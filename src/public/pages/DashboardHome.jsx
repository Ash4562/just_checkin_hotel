import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import successGif from '/SucessRegister.gif';
import { useCreateBookingMutation } from '../../redux/api/BookingAPI';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  people: Yup.array().of(
    Yup.object({
      customer_name: Yup.string().required('User Name is required'),
      checkoutDate: Yup.date().required('Check-Out Date is required'),
      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits')
        .required('Phone Number is required'),
      checkoutTime: Yup.string().required('Check-Out Time is required'),
      address: Yup.string().required('Address is required'),
      room_number: Yup.string().required('Room Number is required'),
      aadhar_number: Yup.string()
        .matches(/^[0-9]{12}$/, 'Aadhaar Number must be 12 digits')
        .required('Aadhaar Number is required'),
      gender: Yup.string().required('Gender is required'),
      aadhar_image: Yup.mixed().required('Aadhaar Image is required'),
    })
  ),
});

const DashboardHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(2); // Declare step inside the component
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if submitted
  // const { verifiedCount, numberOfPeople, aadhaarData } = location.state || { verifiedCount: [], numberOfPeople: 0 };
  const { verifiedCount = [], numberOfPeople = 0, aadhaarData = {} } = useLocation().state || {};
  console.log("verifiedCount:", verifiedCount);
  console.log("adhar:", aadhaarData);
  console.log("Mapped People Data:", aadhaarData?.map((user) => ({
    customer_name: user.name,
    phone_number: user.mobile,
    gender: user.gender,
  })));
  console.log("Type:", typeof verifiedCount);
  console.log("Is Array:", Array.isArray(verifiedCount));
  const [createBooking, { isLoading, isSuccess, error }] = useCreateBookingMutation();
  const [timer, setTimer] = useState(5); // Start timer at 5 seconds


  useEffect(() => {
    if (step === 4 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1); // Decrease timer
      }, 1000); // Update timer every second

      return () => clearInterval(interval); // Clean up the interval on component unmount or timer reach 0
    } else if (timer === 0) {
      // Navigate to home after 5 seconds
      navigate('/');
    }
  }, [step, timer]);



  const handleSubmit = async (values) => {
    if (isLoading) return;
    const data = {
      numberOfPeople: values.people.length,
      customers: values.people.map((person) => {
        const currentDate = new Date();  // Get current date
        const [hours, minutes] = person.checkoutTime.split(':');
        currentDate.setHours(hours, minutes, 0);
        setIsSubmitted(true); // Mark as submitted
        return {
          customer_name: person.customer_name,
          gender: person.gender,
          address: person.address,
          phone_number: person.phone_number,
          aadhar_image: person.aadhar_image ? URL.createObjectURL(person.aadhar_image) : '',
          aadhar_verified: true,
          room_number: person.room_number,
          aadhar_number: person.aadhar_number,
          check_out_time: currentDate.toISOString(),
        };
      }),
    };
    try {
      const response = await createBooking(data).unwrap();
      if (response.status === "success") {
        alert("Data submitted successfully");
        setStep(step + 2);  // Now increment step only on success
      } else {
        alert("There was an error with your submission.");
      }
    } catch (error) {
      console.error('Submission failed', error);
      alert("There was an error with your submission.");
    }
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap mt-36 lg:-mt-1">
      <div className="w-full md:w-3/1 flex flex-col items-center bg-white mt-7">
        {/* Progress Bar */}
        <div className="w-full -mt-20 p-4 mb-8">
          <div className="flex items-center justify-center w-full my-6">
            <div className="flex flex-wrap items-center justify-center">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex items-center">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`dot flex items-center justify-center rounded-full ${step >= s ? 'bg-blue-500' : 'bg-green-500'}
                                                    ${step === 4 && s === 4 ? 'animate-submit' : ''} 
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
                                ? 'Submit'
                                : 'Submit'}
                      </p>
                    </div>
                    {s < 4 && (
                      <div
                        className={`line ${step > s ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ height: '1px', width: '8rem' }}
                      ></div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full pl-3 md:w-4/4 flex items-center justify-center mt-36 bg-white">
          <Formik
            initialValues={{
              people: aadhaarData?.slice(0, verifiedCount).map((user) => ({
                customer_name: user?.name || '',
                checkoutDate: '',
                phone_number: user?.mobile || '',
                checkoutTime: '',
                address: user?.landmark || user?.vtc_name || user?.locality || user?.post_office_name || '',
                room_number: '',
                aadhar_number: user?.reference_id || '',
                gender: user?.gender || '',
                photo: user?.photo_base64 || '',
                aadhar_image: null,
              })) || [],
            }}
          >
            {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => (
              <Form className="w-full -ml-5 -mt-40 max-w-7xl bg-[#ecf8f9] p-8 rounded-lg h-auto">
                {step === 2 && Array.isArray(values.people) && values.people.length > 0 && values.people.map((_, personIndex) => (
                  <div key={personIndex}>
                    <h1 className="text-2xl text-black text-center font-bold mb-4">
                      USER VERIFY {personIndex + 1}
                    </h1>
                    <div className="flex flex-wrap -mx-4 mb-6">
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">User Name</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Enter Name"
                          value={values.people[personIndex].customer_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].customer_name`}
                        />
                        <ErrorMessage name={`people[${personIndex}].customer_name`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Check-Out Date</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="date"
                          value={values.people[personIndex].checkoutDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].checkoutDate`}
                        />
                        <ErrorMessage name={`people[${personIndex}].checkoutDate`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-4 mb-6">
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Phone Number</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Enter Phone Number"
                          value={values.people[personIndex].phone_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].phone_number`}
                        />
                        <ErrorMessage name={`people[${personIndex}].phone_number`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Check-Out Time</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="time"
                          value={values.people[personIndex].checkoutTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].checkoutTime`}
                        />
                        <ErrorMessage name={`people[${personIndex}].checkoutTime`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-4 mb-6">
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Address</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Enter Address"
                          value={values.people[personIndex].address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].address`}
                        />
                        <ErrorMessage name={`people[${personIndex}].address`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Room Number</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Enter Room Number"
                          value={values.people[personIndex].room_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].room_number`}
                        />
                        <ErrorMessage name={`people[${personIndex}].room_number`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                    {/* Display the photo if available */}

                    <div className="flex flex-wrap -mx-4 mb-6">
                      <div className="text-center mb-4 w-full px-4">
                        {values.people[personIndex].aadhar_image && (
                          <img
                            src={`data:image/jpeg;base64,${values.people[personIndex].aadhar_image}`}
                            alt={`${values.people[personIndex].customer_name} Photo`}
                            className="rounded-full w-32 h-32 mx-auto"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-4 mb-6">
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Aadhaar Number</label>
                        <input
                          className="shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="Enter Aadhaar Number"
                          value={values.people[personIndex].aadhar_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name={`people[${personIndex}].aadhar_number`}
                        />
                        <ErrorMessage name={`people[${personIndex}].aadhar_number`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">User Aadhaar</label>
                        <div className="relative w-full h-[145px] flex items-center justify-center">
                          <img
                            src={values.people[personIndex].aadhar_image ? URL.createObjectURL(values.people[personIndex].aadhar_image) : "/adharpng.png"}
                            alt="User Aadhaar Photo"
                            className="max-w-[90%] max-h-[100%] object-contain"
                          />
                          {!values.people[personIndex].aadhar_image && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-3xl">
                              <label htmlFor={`aadhar_image-${personIndex}`} className="cursor-pointer">
                                <span className="text-black p-3 rounded-full shadow-lg">+</span>
                              </label>
                            </div>
                          )}
                          <input
                            type="file"
                            id={`aadhar_image-${personIndex}`}
                            name={`people[${personIndex}].aadhar_image`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setFieldValue(`people[${personIndex}].aadhar_image`, e.target.files[0])}
                          />
                          <ErrorMessage name={`people[${personIndex}].aadhar_image`} component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex  lg:-mt-20   flex-wrap -mx-4 mb-6">
                      <div className="w-full md:w-1/2 px-4">
                        <label className="block text-gray-700 text-sm mb-2">Gender</label>
                        <div className="flex items-center gap-8">
                          <label className="inline-flex mt-3 items-center">
                            <input
                              type="radio"
                              name={`people[${personIndex}].gender`}
                              className="appearance-none w-6 h-6 border-2 border-blue-500 checked:bg-blue-500"
                              value="MALE"
                              checked={values.people[personIndex].gender === 'MALE'}
                              onChange={handleChange}
                            />
                            <span className="text-sm ml-2">Male</span>
                          </label>
                          <label className="inline-flex mt-3 items-center">
                            <input
                              type="radio"
                              name={`people[${personIndex}].gender`}
                              className="appearance-none w-6 h-6 border-2 border-blue-500 checked:bg-blue-500"
                              value="FEMALE"
                              checked={values.people[personIndex].gender === 'FEMALE'}
                              onChange={handleChange}
                            />
                            <span className="text-sm ml-2">Female</span>
                          </label>
                        </div>
                        <ErrorMessage name={`people[${personIndex}].gender`} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        className="w-36 font-bold text-center bg-gradient-to-r from-green-500 to-[#0060EC] text-white py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => handleSubmit(values)}
                        disabled={isLoading}
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>
                ))}
                {step === 4 && (
                  <div className="flex flex-col justify-center items-center space-y-4 h-screen"> {/* Added h-screen for full height */}
                    <h1 className="font-bold text-4xl text-center">User  Verification Successful !!</h1>
                    <p className="font-bold text-xl mt-4 text-center">Redirecting in {timer} seconds...</p>
                    <div className="flex justify-center items-center"> {/* Center the image */}
                      <img
                        src={successGif}
                        alt="Success"
                        className="max-w-[50%] h-auto" // Reduced the size of the gif
                      />
                    </div>

                  </div>
                )}

              </Form>
            )}


          </Formik>
        </div>
      </div>
    </div >
  );
};

export default DashboardHome;
