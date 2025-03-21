import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useAddVerifiedDataMutation } from "../../redux/api/AuthAPI";
import toast from "react-hot-toast"

const AadharVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialNumberOfPeople = location.state?.numberOfPeople || 0;

  const [numberOfPeople, setNumberOfPeople] = useState(initialNumberOfPeople);
  const [aadharNumbers, setAadharNumbers] = useState([]);
  const [verified, setVerified] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionIds, setTransactionIds] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [addVerifiedData] = useAddVerifiedDataMutation();

  useEffect(() => {
    if (numberOfPeople > 0) {
      setAadharNumbers((prev) => {
        const updatedAadharNumbers = [...prev];
        while (updatedAadharNumbers.length < numberOfPeople) {
          updatedAadharNumbers.push("");
        }
        updatedAadharNumbers.length = numberOfPeople;
        return updatedAadharNumbers;
      });
      setVerified((prev) => {
        const updatedVerified = [...prev];
        while (updatedVerified.length < numberOfPeople) {
          updatedVerified.push(false);
        }
        updatedVerified.length = numberOfPeople;
        return updatedVerified;
      });
    }
  }, [numberOfPeople]);

  const handleInputChange = (index, value) => {
    const formattedValue = value
      .replace(/\s/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ");
    const updatedNumbers = [...aadharNumbers];
    updatedNumbers[index] = formattedValue.slice(0, 14);
    setAadharNumbers(updatedNumbers);
  };

  const handleVerify = async (index) => {
    const aadharNumber = aadharNumbers[index].replace(/\s/g, "");

    if (aadharNumber.length !== 12) {
      toast.error("Invalid Aadhaar number!");
      return;
    }

    try {
      setLoadingIndex(index);
      const response = await axios.post(
        "https://api.gridlines.io/aadhaar-api/boson/generate-otp",
        { aadhaar_number: aadharNumber, consent: "Y" },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": import.meta.env.VITE_X_API_KEY,
            "X-Auth-Type": "API-Key",
          },
        }
      );

      if (response.data.status === 200 && response.data.data.code === "1001") {
        console.log("OTP Sent:", response.data.data.message);

        setTransactionIds((prev) => {
          const updatedTransactionIds = [...prev];
          updatedTransactionIds[index] = response.data.data.transaction_id;
          return updatedTransactionIds;
        });
        setOtp("");
        setShowModal(true);
        setSelectedIndex(index);

        toast.success(response.data.data.message || "OTP successfully sent!");

        await addVerifiedData({ number: aadharNumber, type: "Aadhar" }).unwrap();
      } else {
        toast.error("Failed to generate OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying Aadhaar:", error);

      const errorCode = error.response?.data?.error?.code;

      if (errorCode === "OTP_ALREADY_SENT") {
        toast("OTP already sent. Opening modal...", { icon: "ℹ️" });
        setShowModal(true);
        setSelectedIndex(index);
      } else if (errorCode === "UPSTREAM_INTERNAL_SERVER_ERROR") {
        toast.error(
          "Upstream source/Government source internal server error. Please start the process again"
        );
        return;
      } else {
        toast.error(
          error.response?.data?.error?.message || "Something went wrong."
        );
        console.log(error.response?.data?.error?.message);
      }

      if (error.response?.status !== 500) {
        await addVerifiedData({ number: aadharNumber, type: "Aadhar" }).unwrap();
      }
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleSubmitOtp = async () => {
    if (selectedIndex === null) {
      toast.error("Please select a valid Aadhaar entry.");
      return;
    }

    const transactionId = transactionIds[selectedIndex];
    if (!transactionId) {
      toast.error("Transaction ID missing. Please generate OTP again.");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    const otpData = { otp: parseInt(otp, 10), share_code: "1234", include_xml: true };

    try {
      const response = await axios.post(
        "https://api.gridlines.io/aadhaar-api/boson/submit-otp",
        otpData,
        {
          headers: {
            "X-Auth-Type": "API-Key",
            "X-Transaction-ID": transactionId,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-API-Key": import.meta.env.VITE_X_API_KEY,
          },
        }
      );

      if (response.data.data.code === "1003" && response.status === 200) {
        toast.error("Session Expired. Please start the process again."); // Use react-hot-toast
        setShowModal(false);
        return;
      }
      console.log("OTP Verified", response);

      if (response.status === 200 && response.data.data.code === "1002") {
        console.log("OTP Verified Successfully!");

        setResponseData((prevData) => {
          const updatedData = [...prevData];
          updatedData[selectedIndex] = response.data.data.aadhaar_data;
          return updatedData;
        });

        setVerified((prev) => {
          const updatedVerified = [...prev];
          updatedVerified[selectedIndex] = true;
          return updatedVerified;
        });

        toast.success("OTP verified successfully!");
        setShowModal(false);
      } else {
        toast.error("OTP verification failed, please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      const errorCode = error.response?.data?.error?.code;
      if (
        errorCode === "TRANSACTION_ALREADY_COMPLETED" ||
        errorCode === "UPSTREAM_INTERNAL_SERVER_ERROR"
      ) {
        setShowModal(false);
      }
      toast.error(
        error.response?.data?.error?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (!responseData) {
      alert("Please verify the OTP first.");
      return;
    }
    const verifiedCount = verified.filter((v) => v).length;
    navigate("/dashboard", {
      state: { verifiedCount, numberOfPeople, aadhaarData: responseData, aadharNumbers },
    });
  };

  const handleChangePeople = (action) => {
    setNumberOfPeople((prev) => {
      const newCount = action === "increase" ? prev + 1 : Math.max(0, prev - 1);
      return newCount;
    });
  };

  const handleDelete = (index) => {
    console.log("Deleting index: ", index);
    const updatedAadharNumbers = [...aadharNumbers];
    const updatedVerified = [...verified];

    updatedAadharNumbers.splice(index, 1);
    updatedVerified.splice(index, 1);

    setAadharNumbers(updatedAadharNumbers);
    setVerified(updatedVerified);
    setNumberOfPeople((prev) => prev - 1);
  };


  return (
    <>

      <div className="relative flex flex-col items-center justify-start min-h-screen pt-10 ">
        <div className="absolute top-2 right-4 flex">
          <button
            onClick={() => handleChangePeople("increase")}
            className="border border-black text-blue-500 px-3 py-1 rounded-l-full hover:bg-blue-500 hover:text-white transition duration-300 text-sm"
          >
            +
          </button>
          <button
            onClick={() => handleChangePeople("decrease")}
            className="border border-black text-blue-500 px-3 py-1 rounded-r-full hover:bg-blue-500 hover:text-white transition duration-300 text-sm"
          >
            -
          </button>
        </div>

        {aadharNumbers.map((aadhar, index) => (
          <div key={index} className="flex items-center gap-4 w-full max-w-3xl mb-4">
            <div className="relative border-2 border-blue-500 rounded-full p-2 w-full shadow-md">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder={`Enter Aadhar Number for Person ${index + 1}`}
                  value={aadhar}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  maxLength={14}
                  className="flex-1 md:ml-6 p-3 rounded-full outline-none placeholder:text-gray-400 duration-300 border-0"
                />
                <button
                  onClick={() => handleVerify(index)}
                  className={`px-8 py-2 flex items-center justify-center rounded-full ${aadhar.replace(/\s/g, "").length === 12 && !verified[index]
                    ? "bg-[#85D200] text-white cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                    } transition duration-300`}
                  disabled={aadhar.replace(/\s/g, "").length !== 12 || verified[index]}
                >
                  {loadingIndex === index ? "Verifying..." : verified[index] ? "Verified" : "Verify"}
                </button>
              </div>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              <FaTrashAlt size={20} />
            </button>
          </div>
        ))}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">OTP Verification</h2>
              <p className="text-gray-600 text-sm mb-4">
                Please enter the OTP sent to your registered mobile number.
              </p>
              <input
                type="number"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 6);
                  setOtp(value);
                }}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleSubmitOtp()}
                  className={`px-4 py-2 rounded-md transition ${isSubmitting
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Submit OTP"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  disabled={isSubmitting}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center w-full max-w-3xl mt-5">
          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition duration-300"
            disabled={verified.filter((v) => v).length !== numberOfPeople}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default AadharVerify;
