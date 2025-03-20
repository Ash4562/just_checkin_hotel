import React, { useEffect, useState } from 'react';
import logoOfJCI from "/logoOfJCI.svg";
import ArrowSVG from "/ArrowSVG.svg";
import SidebarIMG from "/SidebarIMG.png";
import OtpInput from "react-otp-input";
import Upload from "/icon.svg";
import axios from 'axios';
import { useAddVerifiedDataMutation, useRegisterHotelMutation, useVerifyOTPMutation } from '../../redux/api/AuthAPI';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [hasConsent, setHasConsent] = useState(false);
  const [verifyOTP] = useVerifyOTPMutation();
  const [hasGstin, setHasGstin] = useState(false);
  const [otp, setOtp] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [otpError, setOtpError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [apiError, setApiError] = useState(null);
  const [RegisterHotel] = useRegisterHotelMutation();
  const [createVerifiedData] = useAddVerifiedDataMutation();

  const [formData, setFormData] = useState({
    gstNo: "",
    hotelName: "",
    hotelOwnerName: "",
    email: "",
    phone: "",
    password: "",
    Cpassword: "",
    hotelAddress: "",
    registrationNumber: "",
    city: "",
    amount: "",
    hotelDocument: null,
  });

  const validateGSTIN = (gstin) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstin);
  };

  const handleProceed = async () => {
    if (hasGstin) {
      if (!hasConsent) {
        alert("Please consent to share GST details");
        return;
      }

      if (!formData.gstNo || !validateGSTIN(formData.gstNo)) {
        alert("Please enter a valid GSTIN number");
        return;
      }

      try {
        await createVerifiedData({
          number: formData.gstNo,
          type: "GST"
        }).unwrap();

        const response = await axios.post(
          import.meta.env.VITE_GSTIN_URL,
          { gstin: formData.gstNo, include_filing_data: true, consent: "Y" },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Auth-Type": "API-Key",
              "X-API-Key": import.meta.env.VITE_GSTIN_API_KEY
            },
          }
        );

        const gstinData = response.data?.data?.gstin_data;
        if (!gstinData) throw new Error("No GSTIN data found");

        const addressParts = gstinData?.principal_address?.address?.split(',') || [];
        const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : '';

        setFormData(prev => ({
          ...prev,
          hotelName: gstinData?.trade_name || prev.hotelName,
          hotelOwnerName: gstinData?.legal_name || prev.hotelOwnerName,
          email: gstinData?.principal_address?.email || prev.email,
          phone: gstinData?.principal_address?.mobile || prev.phone,
          hotelAddress: gstinData?.principal_address?.address || prev.hotelAddress,
          registrationNumber: gstinData?.document_id || prev.registrationNumber,
          city: city || prev.city,
        }));

        setCurrentStep(1);
        setApiError(null);
      } catch (error) {
        console.error("GST verification error:", error);
        setApiError(error.response?.data?.message || "Failed to verify GSTIN");
      }
    } else {
      setCurrentStep(1);
    }
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.hotelName || !formData.hotelOwnerName ||
          !formData.email || !formData.phone ||
          !formData.password || !formData.Cpassword) {
          alert("Please fill all required fields");
          return;
        }
        if (formData.password !== formData.Cpassword) {
          alert("Passwords do not match");
          return;
        }
        break;

      case 2:
        if (!formData.hotelAddress || !formData.registrationNumber ||
          !formData.city || !formData.amount) {
          alert("Please fill all payment details");
          return;
        }
        break;
    }
    setCurrentStep(prev => prev + 1);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar;
  };

  const handleRegister = async () => {
    if (!validatePassword(formData.password)) {
      alert("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
      return;
    }

    try {
      const payload = { email: formData.email };
      await RegisterHotel(payload).unwrap();
      setCurrentStep(4);
    } catch (error) {
      console.error("Registration Error:", error);
      setApiError(error?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return false;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "hotelDocument" && value) {
          payload.append(key, value, value.name);
        } else if (value !== null) {
          payload.append(key, value);
        }
      });
      payload.append("otp", otp);

      await verifyOTP(payload).unwrap();
      navigate("/login");
      return true;
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setOtpError(error?.data?.message || "Invalid OTP. Please try again.");
      return false;
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, hotelDocument: file }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-8 mt-6 sm:mt-8 lg:mt-0">
        <img src={logoOfJCI} alt="" className="mt-10 items-center w-44 py4" />

        {currentStep === 0 && (
          <>
            <h1 className="text-2xl font-medium mb-4 text-center font-poppins">
              Do You Have GSTIN Number?
            </h1>
            <div className="flex flex-row justify-between items-center px-12 mb-20">
              <div className="flex flex-row pl-10 items-center gap-8">
                <label className="inline-flex mt-3 items-center">
                  <input
                    type="radio"
                    name="gstin"
                    className="appearance-none w-6 h-6 border-2 border-[#0060EC8C] rounded-lg checked:bg-[#0060EC] checked:border-[#0060EC8C] focus:outline-none"
                    checked={hasGstin}
                    onChange={() => setHasGstin(true)}
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex mt-3 items-center">
                  <input
                    type="radio"
                    name="gstin"
                    className="appearance-none w-6 h-6 border-2 border-[#0060EC8C] rounded-lg checked:bg-[#0060EC] checked:border-[#0060EC8C] focus:outline-none"
                    checked={!hasGstin}
                    onChange={() => setHasGstin(false)}
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {hasGstin && (
              <>
                <input
                  placeholder="Enter Your GSTIN Number"
                  type="text"
                  id="gstNo"
                  name="gstNo"
                  maxLength={15}
                  className="uppercase w-4/5 mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                />
                <label className="inline-flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">I consent to share my GST data</span>
                </label>
              </>
            )}

            {apiError && <p className="text-red-500 mt-2">{apiError}</p>}

            <div className="mb-4 flex flex-col justify-center items-center space-y-4">
              <button
                type="button"
                onClick={handleProceed}
                className="flex items-center justify-center gap-2 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"
              >
                Proceed <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
              </button>
              <p className="font-poppins font-normal text-lg leading-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#0060EC] font-poppins leading-6 font-bold cursor-pointer hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center font-poppins">
              REGISTER
            </h1>
            <div className="mb-4">
              <input
                placeholder="Hotel Name"
                type="text"
                id="hotelName"
                name="hotelName"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })} />
            </div>
            <div className="mb-4">
              <input
                placeholder="Hotel Owner Name"
                type="text"
                id="hotelOwnerName"
                name="hotelOwnerName"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, hotelOwnerName: e.target.value })}
                value={formData.hotelOwnerName}

              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Email Address"
                type="email"
                id="email"
                name="email"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}

              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Phone Number"
                type="text"
                id="phone"
                name="phone"
                maxLength={10}
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                value={formData.phone}

              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Password"
                type="password"
                id="password"
                name="password"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Confirm Password"
                type="password"
                id="Cpassword"
                name="Cpassword"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, Cpassword: e.target.value })}
              />
            </div>
            <div className="mb-4 flex flex-col justify-center items-center space-y-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center justify-center gap-2 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"
              >
                Next
                <span className="flex items-center justify-center">
                  <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
                </span>
              </button>
              <p className="font-poppins font-normal text-lg leading-6">
                Already have an account?{" "}
                <a
                  href="/Register"
                  className="text-[#0060EC] font-poppins leading-6 font-bold cursor-pointer hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </>
        )}
        {currentStep === 2 && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center font-poppins">
              Payment Information
            </h1>
            <div className="mb-4">
              <input
                placeholder="Hotel Address"
                type="text"
                id="hotelAddress"
                name="hotelAddress"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, hotelAddress: e.target.value })}
                value={formData.hotelAddress} // Update this line
              />
            </div>
            <div className="mb-4">
              <input
                placeholder="Hotel Registration Number"
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                value={formData.registrationNumber} // Update this line
              />
            </div>
            <div className="mb-4">
              <input
                placeholder="GSTIN Number"
                type="text"
                id="gstinNumber"
                name="gstinNumber"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                value={formData.gstNo} // Update this line
              />
            </div>
            <div className="mb-4">
              <input
                placeholder="City"
                type="text"
                id="city"
                name="city"
                className="w-[511px] mx-auto px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                value={formData.city} // Update this line
              />
            </div>
            <div className="mb-4 relative">
              <p className='mb-4'>Amount To Be Paid</p>
              <input
                placeholder="Amount to be Paid"
                type="number"
                id="amount"
                name="amount"
                className="w-[511px] px-4 py-1 mb-4 border border-blue-500 rounded-2xl font-light font-inter text-black text-lg focus:outline-none focus:border-blue-500 hover:border-blue-500 transition duration-200 pr-16"
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                value={formData.amount} // Update this line if you want to bind the amount as well
              />
              <button
                type="button"
                className="absolute right-2 mt-5 transform -translate-y-1/2 bg-[#85D200] text-white py-1 px-3 rounded-lg font-inter font-bold text-xs leading-4"
                onClick={() => {
                  console.log("Pay button clicked with amount:", formData.amount);
                }}
              >
                Pay
              </button>
            </div>

            <div className="mb-4 flex flex-col justify-center items-center space-y-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center justify-center gap-2 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"
              >
                Next
                <span className="flex items-center justify-center">
                  <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
                </span>
              </button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center font-poppins">
              Upload Document
            </h1>
            <div className="mb-4">
              <p className='font-poppins mb-3'>Hotel Documents</p>
              <input
                onChange={handleDocumentUpload}
                id="file"
                type="file"
                name="hotelDocument"
                className="hidden bg-white"
              />
              <label
                htmlFor="file"
                className="text-black border-[#0060EC8C] text-lg !border-customBlue !border-opacity-75 w-[600px] px-16 py-32 border rounded-2xl font-light font-poppins flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition"
              >
                {formData?.hotelDocument?.name ? (
                  formData.hotelDocument.name
                ) : (
                  <div className="flex flex-col items-center">
                    <img src={Upload} alt="" />
                    <p className="font-inter font-light text-sm leading-4">
                      Upload from your device
                    </p>
                  </div>
                )}
              </label>
            </div>
            <div className="mb-4 flex flex-col justify-center items-center space-y-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"
                onClick={() => {
                  handleRegister();
                  setCurrentStep(4);
                }}
              >
                Submit
                <span className="flex items-center justify-center">
                  <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
                </span>
              </button>
            </div>
          </>
        )}


        {currentStep === 4 && (
          <div className="flex flex-col items-center space-y-40">
            <div>
              <h1 className="text-2xl mb-8 text-center font-bold">Register</h1>
              <div className="flex flex-col items-center">
                <p className="mb-4">Verify Your Email Address</p>
                <p className="mb-4 text-center">
                  Enter the verification code we just sent to you
                </p>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderInput={(props) => <input {...props} />}
                  skipDefaultStyles={true}
                  inputStyle={`
                  w-12 h-12 
                  text-center 
                  border border-[#0060EC8C] border-opacity-55 
                  rounded-xl
                  focus:outline-none focus:ring-1 focus:ring-[#0060EC] focus:ring-opacity-50
                  text-lg font-medium
                `}
                  containerStyle={`flex justify-center gap-8`}
                />

                <p className="my-2">
                  Don’t receive code?{" "}
                  {timeLeft > 0 ? (
                    <span className="font-poppins text-sm font-semibolds text-gray-400 cursor-not-allowed">
                      Resend in {formatTime(timeLeft)}
                    </span>
                  ) : (
                    <Link
                      to="/dashboard/resend"
                      className="font-poppins text-sm font-semibolds text-[#0060EC] cursor-pointer"
                    >
                      Resend
                    </Link>
                  )}
                </p>

                {otpError && <p className="text-red-500 mt-2">{otpError}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 mx-8 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"
                onClick={async () => {
                  setOtpError(""); // Clear previous errors
                  const isValidOtp = await handleVerifyOTP(); // Check OTP validity
                  if (isValidOtp) {
                    setCurrentStep(5); // Move to the next step only if no errors
                  }
                }}
              >
                Register
                <span className="flex items-center justify-center">
                  <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
                </span>
              </button>
              <p className="font-poppins font-normal">
                Already Have Account?{" "}
                <Link
                  to="/login"
                  className="font-bold font-poppins text-[#0060EC] cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}




        {currentStep === 5 && (
          <div className="flex flex-col items-center">
            <p className="font-bold font-poppins text-3xl leading-9">
              Welcome !!
            </p>
            <p className="font-normal font-poppins text-xl leading-9">
              Registration Successfull !!
            </p>
            <img
              src={
                "https://s3-alpha-sig.figma.com/img/6a9c/ffdd/f9b978f3fe4e8b3f5b187d888b395be7?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hBhe312ahPMSPz1lV-hemsUpJfNSuq06sshkEqvLBZ8PFtQl-4EsvAToV6V3jy8hhbIJIQFarpExbFccc1OYssKJJbG-wGL~sQw6KdfZKzIroanvyN6W2z0Q46OKlsUzdn8ZHfTaWXOIh-wfPsr5UHYSDQ-T7pVZQhE0B9M0ZFiwK5WdNOOnw1ACAhJQZUordLpDl99Jav7c~8M3-iATvO~DtJG3bmqibKXfPrM4s1rSrVIcww4KOVnleRJMopuZZjeugz4b7KeHR78uBzsXm33z2ExISK0E1F9RDWnObfhzfHATFRGk535KrQo2i2lYjoq8fy0gFf9j4QzekYExzg__"
              }
              alt=""
            />
            <Link
              to="/"
              type="button"
              className="flex items-center justify-center gap-2 shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-12 rounded-full hover:opacity-80 transition duration-300 text-lg"

            >
              ok
              <span className="flex items-center justify-center">
                <img src={ArrowSVG} alt="Arrow Icon" className="ml-2" />
              </span>
            </Link>
            <div className="flex flex-col text-black text-opacity-55 text-center">
              <p>Your details are being verified</p>
              <p>You will receive an email once the </p>
              <p>verification is successful !!</p>
            </div>
          </div>
        )}

      </div>

      <div className="relative w-1/2 flex-1 hidden lg:block bg-cover object-cover overflow-hidden">
        <img src={SidebarIMG} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Register; 