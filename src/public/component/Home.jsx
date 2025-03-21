import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from "/HomePage.jpeg";
import './Home.css';
import toast from "react-hot-toast"

const Home = () => {
    const [numberOfPeople, setNumberOfPeople] = useState(''); // Number of people input state
    const [isValid, setIsValid] = useState(false); // IsValid will check if the numberOfPeople is filled
    const [isVerified, setIsVerified] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for spinner
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Add state for login status
    const navigate = useNavigate();
    // Handle input for number of people
    const handleInputChange = (e) => {
        if (!isLoggedIn) {
            toast.error('Please login first');
            return;
        }
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setNumberOfPeople(value);
        setIsValid(value.length > 0); // Ensure the field is not empty
    };

    // Handle verify button click
    const handleVerify = () => {
        if (isValid) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setVerificationMessage('Verified');
                setIsVerified(true)
                // navigate('/dashboard/AadharVerify', { state: { numberOfPeople: parseInt(numberOfPeople, 10) } });
            }, 2000); // Simulate a delay for verification
        }
    };

    const handleContinue = () => {
        navigate('/dashboard/AadharVerify', { state: { numberOfPeople: parseInt(numberOfPeople, 10) } });
    };



    const handleLogin = () => {
        setIsLoggedIn(true); // Set to true to simulate login
    };

    return (
        <>
            <div className="w-full h-screen p-3 relative">
                <div
                    className="w-full h-[70vh] bg-cover bg-center rounded-3xl border border-gray-300 shadow-lg overflow-hidden px-6"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                ></div>

                <div className="absolute top-0 px-7 left-0 w-full h-[70vh] flex flex-col items-center justify-center">
                    <div className="bg-white rounded-full shadow-xl shadow-blue-700 text-center max-w-3xl w-full p-2">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Enter Number Of People"
                                className="flex-1 ml-6 rounded-full border-gray-300 outline-none"
                                value={numberOfPeople}
                                onChange={handleInputChange}
                                disabled={!isLoggedIn} // Disable input if not logged in
                            />

                            <button
                                className={`w-16 h-16 flex items-center justify-center rounded-full ${isValid && isLoggedIn ? 'hover:bg-[#85D200] bg-[#85D200] text-white' : 'bg-gray-300 cursor-not-allowed'} transition duration-300`}
                                onClick={handleVerify}
                                disabled={!isValid || !isLoggedIn} // Disable button if not logged in
                            >
                                <i className="fas fa-arrow-right text-white text-2xl"></i>
                            </button>

                        </div>
                    </div>

                    {/* Loader Animation */}
                    {loading && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg text-gray-700">Verifying...</span>
                        </div>
                    )}

                    {/* Notification Message */}
                    {numberOfPeople && !loading && !isVerified && (
                        <p className="text-black font-bold mt-4 text-lg">
                            Number of people: <span className="font-semibold">{numberOfPeople}</span> entered successfully.
                        </p>
                    )}

                    {/* Verification Message */}
                    {verificationMessage && !loading && (
                        <p className="text-black mt-4 text-lg">
                            {verificationMessage} <span className="font-semibold">Proceed to next step!</span>
                        </p>
                    )}

                    {/* Continue Button after Verification */}
                    {isVerified && !loading && (
                        <button
                            onClick={handleContinue}
                            className="px-8 py-2 mt-10 rounded-full hover:bg-[#85D200] bg-blue-600 text-white hover:text-white transition duration-300"
                        >
                            Continue
                        </button>
                    )}
                </div>

                {/* Cards Section */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <Link
                        to="/dashboard/DashboardFirst"
                        className="flex flex-row h-32 items-center bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-xl hover:bg-[#85D200] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-[#85D200]"
                    >
                        <div className="flex items-center justify-center w-20 h-24">
                            <img
                                className="object-cover ml-44 w-full h-full rounded-lg"
                                src="/Adduser.png"
                                alt="Image 1"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center p-4 leading-normal">
                            <h5 className="mb-2 text-2xl ml-20 tracking-tight text-gray-900 dark:text-white">
                                Add User
                            </h5>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link
                        to="/dashboard/userdetails"
                        className="flex flex-row h-32 items-center bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-xl hover:bg-[#85D200] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-[#85D200]"
                    >
                        <div className="flex items-center justify-center w-20 h-20">
                            <img
                                className="object-cover ml-36 w-full h-full rounded-lg"
                                src="/userdetails.png"
                                alt="Image 1"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center p-4 leading-normal">
                            <h5 className="mb-2 text-2xl ml-20 tracking-tight text-gray-900 dark:text-white">
                                User Details
                            </h5>
                        </div>
                    </Link>

                    {/* Card 3 */}
                    <Link
                        to="/dashboard/profile"
                        className="flex flex-row h-32 items-center bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-xl hover:bg-[#85D200] dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-[#85D200]"
                    >
                        <div className="flex items-center justify-center w-20 h-20">
                            <img
                                className="object-cover ml-40 w-full h-full rounded-lg"
                                src="/yourprofile.png"
                                alt="Image 1"
                            />
                        </div>
                        <div className="flex flex-col ml-20 justify-center items-center p-4 leading-normal">
                            <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">
                                Your Profile
                            </h5>
                        </div>
                    </Link>
                </div>
            </div>

            {/* <ToastContainer /> */}
        </>
    );
};

export default Home;
