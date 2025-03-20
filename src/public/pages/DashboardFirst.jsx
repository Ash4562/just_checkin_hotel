import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using 'useNavigate' for navigation
import backgroundImage from "/HomePage.jpeg";

const DashboardFirst = () => {
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const navigate = useNavigate();

    const handlePeopleInput = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNumberOfPeople(value);
        setIsValid(/^\d+$/.test(value) && value > 0);
    };

    const handleVerify = () => {
        if (isValid) {
            setLoading(true);
            setVerificationMessage('Verifying Number of People...');

            setTimeout(() => {
                setLoading(false);
                setVerificationMessage('Verification successful, you may proceed with the user entry.');

                navigate('/dashboard/AadharVerify', { state: { numberOfPeople: parseInt(numberOfPeople, 10) } });
            }, 2000);
        } else {
            setVerificationMessage('Please enter a valid number of people.');
        }
    };

    return (
        <div className="w-full  mt-11 relative">
            <div
                className="w-full h-[75vh] bg-cover bg-center rounded-3xl border border-gray-300 shadow-lg overflow-hidden px-6 mt-6 sm:mt-0"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            <div className="absolute top-0 px-7 left-0 w-full h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="bg-white rounded-full shadow-xl text-center max-w-3xl w-full p-6">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Enter Number of People"
                            className="flex-1 ml-6 rounded-full border-gray-300 outline-none px-4 py-2"
                            value={numberOfPeople}
                            onChange={handlePeopleInput}
                            maxLength={3}
                        />
                    </div>
                </div>

                <button
                    className={`w-52 px-8 py-3  rounded-full ${isValid ? 'bg-[#85D200] text-white' : 'bg-gray-300 cursor-not-allowed'
                        } transition duration-300`}
                    onClick={handleVerify}
                    disabled={!isValid}
                >
                    {loading ? (
                        <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto"></div>
                    ) : (
                        'Continue'
                    )}
                </button>


                {verificationMessage && (
                    <p className="mt-4 text-blue-500 text-center">{verificationMessage}</p>
                )}
            </div>
        </div>
    );
};

export default DashboardFirst;
