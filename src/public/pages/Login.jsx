import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import img from "/login.jpg";
import { toast } from "react-toastify"; // Import toast
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { useLoginMutation } from "../../redux/api/AuthAPI";
import { FaUser } from "react-icons/fa";

const Login = () => {
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await login(values).unwrap();
                console.log("Login Successful:", response);

                const token = response.token || response.data?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("Token saved:", token);

                    toast.success("🎉 Login Successful!", {
                        position: "top-right",
                        autoClose: 3000, // 3 sec me close hoga
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                    });
                    

                    navigate("/dashboard/profile");
                } else {
                    console.error("Token not found in response.");
                }
            } catch (err) {
                console.error("Login Failed:", err);

                toast.error("❌ Login failed, please try again!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                
            }
        },
    });

    return (

        <div className="flex h-screen">
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-4 lg:p-8 mt-6 sm:mt-8 lg:mt-0">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-8 text-black-800 text-left sm:text-center">
                        Login
                    </h1>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-4 flex items-center border-b-2 border-[#0060EC]">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 focus:outline-none focus:ring-0 focus:border-[#0060EC]"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FaUser className="text-[#0060EC] ml-2" />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mb-2">
                                {formik.errors.email}
                            </div>
                        ) : null}

                        {/* Password Field */}
                        <div className="mb-4 flex items-center border-b-2 border-[#0060EC]">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-2 focus:outline-none focus:ring-0 focus:border-[#0060EC]"
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <RiLockPasswordLine className="text-[#0060EC] ml-2" />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm mb-2">
                                {formik.errors.password}
                            </div>
                        ) : null}

                        {/* Error Message */}
                        {isError && (
                            <div className="text-red-500 text-sm mb-2">
                                {error?.data?.message || "Login failed"}
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-8">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 appearance-none border border-blue-700 rounded focus:outline-none checked:border-[#0060EC] focus:ring-1 focus:ring-[#0060EC]"
                                />
                                <span className="ml-2 text-gray-700">Remember Me</span>
                            </label>
                            <Link to="/forgotPass"
                                href="#"
                                className="text-[#0060EC] hover:underline font-bold text-sm"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="flex justify-center items-center mt-4">
                            <button
                                type="submit"
                                className={`w-36 text-center bg-gradient-to-r from-green-500 to-[#0060EC] text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formik.isSubmitting || isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={!formik.isValid || formik.isSubmitting || isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>


                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-[#0060EC] hover:underline font-bold"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Full Image */}
            <div
                className="w-1/2 hidden lg:block bg-cover bg-center h-full"
                style={{ backgroundImage: `url(${img})` }}
            ></div>
        </div>
    );
};

export default Login;
