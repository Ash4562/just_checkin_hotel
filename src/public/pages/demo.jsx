import React, { useState } from 'react'
import { Formik, useFormik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const demo = () => {
    const [step, setStep] = useState(2);

    const handleContinue = () => {
        setStep(step + 1);
    };

    const formik = useFormik({
        initialValues: {
            // step 1
            userName: '',
            aadhaarNumber: '',
            phoneNumber: '',
            dateOfRegistration: '',
            address: '',
            gender: '',
            roomNumber: '',
            checkInTime: '',
            checkInDate: '',
            // step2
            checkOutTime: '',
            checkOutDate: '',
            amountPaid: '',
            numberOfPeople: '',
            verified: '',
            uploadAadhaar: null,
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('User Name is required'),
            aadhaarNumber: Yup.string()
                .matches(/^[0-9]{12}$/, 'Aadhaar Number must be 12 digits')
                .required('Aadhaar Number is required'),
            phoneNumber: Yup.string()
                .matches(/^\d{10}$/, 'Phone Number must be 10 digits')
                .required('Phone Number is required'),
            dateOfRegistration: Yup.date().required('Date of Registration is required'),
            address: Yup.string().required('Address is required'),
            gender: Yup.string().required('Gender is required'),
            roomNumber: Yup.string().required('Room Number is required'),
            checkInTime: Yup.string().required('Check-In Time is required'),
            checkInDate: Yup.date().required('Check-In Date is required'),
            checkOutTime: Yup.string().required('Check-Out Time is required'),
            checkOutDate: Yup.date().required('Check-Out Date is required'),
            amountPaid: Yup.number()
                .typeError('Amount Paid must be a number')
                .required('Amount Paid is required'),
            numberOfPeople: Yup.number()
                .typeError('Number of People must be a number')
                .required('Number of People is required'),
            verified: Yup.string().required('Verification is required'),
            uploadAadhaar: Yup.mixed().required('Aadhaar upload is required'),
        }),
        onSubmit: (values) => {
            console.log('Form Submitted', values);
            handleContinue();
        },
    });

    return <>
        <div className="flex flex-wrap md:flex-nowrap mt-36 lg:-mt-1">
            <div className="w-full md:w-3/1 flex flex-col items-center bg-white mt-10">
                {/* Progress Bar cha code */}
                <div className="w-full -mt-20 p-4 mb-8">
                    <div className="flex items-center justify-center w-full my-6">
                        <div className="flex flex-wrap items-center justify-center">
                            {[1, 2, 3, 4].map((s) => (
                                <React.Fragment key={s}>
                                    <div className="flex items-center">
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={`dot flex items-center justify-center rounded-full ${step >= s ? 'bg-blue-500' : 'bg-green-500'
                                                    } ${step === 4 && s === 4 ? 'animate-submit' : ''} 
                w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12`}
                                            ></div>
                                            <p className="absolute top-full mt-1 text-[10px] sm:text-xs lg:text-sm whitespace-nowrap">
                                                {s === 1
                                                    ? 'Search'
                                                    : s === 2
                                                        ? 'Verify User'
                                                        : s === 3
                                                            ? 'Add Details'
                                                            : s === 4 && step !== 4
                                                                ? 'submit'
                                                                : 'Submit'}
                                            </p>
                                        </div>
                                        {s < 4 && (
                                            <div
                                                className={`line ${step > s ? 'bg-blue-500' : 'bg-green-500'
                                                    } h-1 w-8 sm:w-12 lg:w-16`}
                                            ></div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Form he bhai ithe  */}
                <div className="w-full  pl-3  md:w-4/4 flex items-center justify-center mt-36 bg-white">
                    <form
                        className="w-full -ml-5 -mt-40 max-w-7xl bg-[#ecf8f9] p-8 rounded-lg h-auto"
                        onSubmit={formik.handleSubmit}
                    >
                        {step === 2 && (
                            <>
                                <div className="flex flex-wrap -mx-4 mb-6">
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">User Name</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="userName"
                                            placeholder="Enter Name"
                                            value={formik.values.userName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.userName && formik.errors.userName && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.userName}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Aadhaar Number</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="aadhaarNumber"
                                            placeholder="Enter Aadhaar Number"
                                            value={formik.values.aadhaarNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.aadhaarNumber && formik.errors.aadhaarNumber && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.aadhaarNumber}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-4 mb-6">
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="Enter Phone Number"
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Date of Registration</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="date"
                                            name="registrationDate"
                                            value={formik.values.registrationDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.registrationDate && formik.errors.registrationDate && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.registrationDate}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-4 mb-6">
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Address</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.address && formik.errors.address && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Gender</label>
                                        <div className="flex items-center gap-8">
                                            <label className="inline-flex mt-3 items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Male"
                                                    className="appearance-none w-6 h-6 border-2 border-blue-500 rounded-sm checked:bg-green-500 checked:border-green-500 focus:outline-none"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    checked={formik.values.gender === "Male"}
                                                />
                                                <span className="ml-2 text-gray-700">Male</span>
                                            </label>
                                            <label className="inline-flex mt-3 items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Female"
                                                    className="appearance-none w-6 h-6 border-2 border-blue-500 rounded-sm checked:bg-green-500 checked:border-green-500 focus:outline-none"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    checked={formik.values.gender === "Female"}
                                                />
                                                <span className="ml-2 text-gray-700">Female</span>
                                            </label>
                                        </div>
                                        {formik.touched.gender && formik.errors.gender && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
                                        )}
                                    </div>

                                </div>
                                <div className="flex flex-wrap -mx-4 mb-6">
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Room Number</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="roomNumber"
                                            placeholder="Enter Room Number"
                                            value={formik.values.roomNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.roomNumber && formik.errors.roomNumber && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.roomNumber}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Check-In Time</label>
                                        <input
                                            className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="time"
                                            name="checkInTime"
                                            value={formik.values.checkInTime}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.checkInTime && formik.errors.checkInTime && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.checkInTime}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Repeat for remaining fields */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleContinue}
                                        className="w-36 bg-gradient-to-r to-green-500 from-[#0060EC] text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {/* step3 Steps */}
                        <form onSubmit={formik.handleSubmit}>
                            {step === 3 && (
                                <>
                                    <div className="flex flex-wrap -mx-4 mb-6">
                                        <div className="w-full md:w-1/2 px-4">
                                            <label className="block text-gray-700 text-sm mb-2">Check-In Date</label>
                                            <input
                                                className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="date"
                                                name="checkInDate"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.checkInDate}
                                            />
                                            {formik.touched.checkInDate && formik.errors.checkInDate && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.checkInDate}</div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-1/2 px-4">
                                            <label className="block text-gray-700 text-sm mb-2">Check-Out Time</label>
                                            <input
                                                className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="time"
                                                name="checkOutTime"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.checkOutTime}
                                            />
                                            {formik.touched.checkOutTime && formik.errors.checkOutTime && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.checkOutTime}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap -mx-4 mb-6">
                                        <div className="w-full md:w-1/2 px-4">
                                            <label className="block text-gray-700 text-sm mb-2">Check-Out Date</label>
                                            <input
                                                className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="date"
                                                name="checkOutDate"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.checkOutDate}
                                            />
                                            {formik.touched.checkOutDate && formik.errors.checkOutDate && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.checkOutDate}</div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-1/2 px-4">
                                            <label className="block text-gray-700 text-sm mb-2">Amount Paid</label>
                                            <input
                                                className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="text"
                                                name="amountPaid"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.amountPaid}
                                                placeholder="Enter Amount Paid"
                                            />
                                            {formik.touched.amountPaid && formik.errors.amountPaid && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.amountPaid}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap -mx-4 mb-6">
                                        <div className="w-full md:w-1/2 px-4">
                                            <label className="block text-gray-700 text-sm mb-2">Number of People</label>
                                            <input
                                                className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                type="number"
                                                name="numberOfPeople"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.numberOfPeople}
                                                placeholder="Enter Number of People"
                                            />
                                            {formik.touched.numberOfPeople && formik.errors.numberOfPeople && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.numberOfPeople}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 px-4">
                                        <label className="block text-gray-700 text-sm mb-2">Verified</label>
                                        <div className="flex items-center gap-8">
                                            <label className="inline-flex mt-3 items-center">
                                                <input
                                                    type="radio"
                                                    name="verified"
                                                    value="Yes"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    checked={formik.values.verified === "Yes"}
                                                    className="appearance-none w-6 h-6 border-2 border-blue-500 rounded-sm checked:bg-green-500 checked:border-green-500 focus:outline-none"
                                                />
                                                <span className="ml-2 text-gray-700">Yes</span>
                                            </label>
                                            <label className="inline-flex mt-3 items-center">
                                                <input
                                                    type="radio"
                                                    name="verified"
                                                    value="No"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    checked={formik.values.verified === "No"}
                                                    className="appearance-none w-6 h-6 border-2 border-blue-500 rounded-sm checked:bg-green-500 checked:border-green-500 focus:outline-none"
                                                />
                                                <span className="ml-2 text-gray-700">No</span>
                                            </label>
                                        </div>
                                        {formik.touched.verified && formik.errors.verified && (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.verified}</div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap lg:ml-7 -mt-40 mb-6 justify-end">
                                        <div className="w-full bg-[#ecf8f9] md:w-1/2 relative">
                                            <label className="block text-gray-700 text-sm mb-2" htmlFor="upload-aadhar">
                                                Upload Aadhaar
                                            </label>
                                            <input
                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                id="upload-aadhar"
                                                type="file"
                                                name="uploadAadhaar"
                                                accept="image/*"
                                                onChange={(event) => {
                                                    formik.setFieldValue("uploadAadhaar", event.currentTarget.files[0]);
                                                }}
                                            />
                                            {formik.touched.uploadAadhaar && formik.errors.uploadAadhaar && (
                                                <div className="text-red-500 text-sm mt-1">{formik.errors.uploadAadhaar}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            onClick={handleContinue}
                                            className="w-36 bg-gradient-to-r to-green-500 from-[#0060EC] text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                        {step === 4 && (
                            <>
                                <div className="flex flex-col h-96 items-center justify-center">
                                    <h1 className="font-bold text-4xl mb-4">User Verification Successful!!</h1>

                                    <img
                                        src="/SucessRegister.gif"
                                        alt="Success GIF"
                                        className="w-48 h-72 object-contain"
                                    />
                                    <Link
                                        to="/"
                                        type="button"
                                        className="btn w-24 text-center font-bold text-2xl px-4 py-2 border border-gray-400 bg-[#85D200] text-white rounded-full shadow-md hover:bg-[#85D200] hover:border-[#85D200] hover:shadow-lg transition-all duration-300 ease-in-out"
                                    >
                                        OK
                                    </Link>


                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    </>

};

export default demo