import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation, useResendOtpMutation, useResetPasswordMutation } from '../../redux/api/AuthAPI';
import myGif from '/SucessRegister.gif';
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Error state added
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: ResetPasswordLoading, isSuccess, error }] = useResetPasswordMutation();

  const [resendTimer, setResendTimer] = useState(600);
  const [resendOtp] = useResendOtpMutation()

  useEffect(() => {
    if (step === 4 && isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, isSuccess]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000); // Update every second

      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleNext = async () => {
    try {

      if (step === 1) {
        if (!email) {

          toast.error("Please enter your email");
          return;
        }

        const result = await forgotPassword({ email });

        console.log(result);
        toast.success(result.data.message);
        if (result?.data?.message) {
          toast.success(result.data.message);


          setStep(2);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } else {
        setStep(prevStep => prevStep + 1);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email });
      toast.success("OTP has been resent to your email.");
      setResendTimer(600); // Reset timer to 5 minutes
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };


  const handlePasswordReset = async () => {

    if (resendTimer === 0) {
      toast.error("OTP is expired, please request a new one.");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Please enter both password fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (otp.some((digit) => digit === "" || digit === undefined)) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    const resetData = {
      email,
      otp: otp.join(""),
      newPassword: password,
      confirmNewPassword: confirmPassword,
    };

    try {
      setIsResetPasswordLoading(true);
      const response = await resetPassword(resetData);
      console.log(response);

      if (response?.data?.message) {
        toast.success(response.data.message);
        setStep(4);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (err) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setIsResetPasswordLoading(false);
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
                disabled={isForgotPasswordLoading || resendTimer === 0}
              >
                Continue
              </button>
            </div>
            {/* Resend OTP Button (Appears After 5 Minutes) */}
            <div className="mt-4">
              {resendTimer > 0 ? (
                <p className="text-gray-500">
                  Resend OTP in {Math.floor(resendTimer / 60)}:
                  {(resendTimer % 60).toString().padStart(2, "0")}
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  Resend OTP
                </button>
              )}
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
                disabled={ResetPasswordLoading}
              >
                {ResetPasswordLoading ? 'Processing...' : 'Submit'}
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
