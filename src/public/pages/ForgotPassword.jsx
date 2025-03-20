import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../redux/api/AuthAPI';
import myGif from '/SucessRegister.gif';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Error state added


  const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading, isSuccess, error }] = useResetPasswordMutation();

  useEffect(() => {
    if (step === 4 && isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, isSuccess]);

  const handleNext = async () => {
    if (step === 1) {
      // Request OTP
      await forgotPassword({ email });
      setStep(2);
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };
  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
  
    setErrorMessage('');
  
    const resetData = {
      email,
      otp: otp.join(''), // OTP array ko string mein convert karna
      newPassword: password,
      confirmNewPassword: confirmPassword,
    };
  
    try {
      await resetPassword(resetData);
      setStep(4); 
    } catch (err) {
      setErrorMessage("Error resetting password. Please try again.");
    }
  };
  
  
  
  return (
    <div className="relative flex justify-center items-center h-[600px] overflow-hidden">
      {/* Background Half-Circle */}
      <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[900px] h-[600px] bg-[rgba(75,206,255,0.34)] rounded-t-full"></div>

      {/* Content Container */}
      <div className="relative max-w-md mx-auto text-center border border-3 -mt-28 p-6 bg-white rounded-lg shadow-lg z-10">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Enter Your Email Address</h2>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-4 ring-2 ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center items-center">
              <button
                onClick={handleNext}
                className="flex items-center justify-center shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-4 hover:opacity-80 transition duration-300 text-lg"
                disabled={isForgotPasswordLoading}
              >
                {isForgotPasswordLoading ? 'Sending...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
            <div className="flex justify-center gap-4 mb-4">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-lg border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNext}
                className="shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-5 hover:opacity-80 transition duration-300 text-lg"
                disabled={isForgotPasswordLoading}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-blue-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-blue-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handlePasswordReset}
                className="shadow-md shadow-[#0060EC52] font-semibold bg-gradient-to-r from-[#0060ec] to-[#85d200] text-white py-2 px-5 hover:opacity-80 transition duration-300 text-lg"
                disabled={isResetPasswordLoading}
              >
                {isResetPasswordLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-4">
              Password Changed Successfully!
            </div>
            <div className="mb-4">
              <img src={myGif} alt="Success animation" className="w-32 h-32 mx-auto" />
            </div>
            <p className="text-lg text-gray-600">
              Redirecting you to the login page in <span className="font-bold text-blue-500">5 seconds</span>...
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Go to Login Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
