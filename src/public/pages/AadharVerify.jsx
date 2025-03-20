import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; // Importing trash icon
import axios from "axios";

const AadharVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialNumberOfPeople = location.state?.numberOfPeople || 0;

  const [numberOfPeople, setNumberOfPeople] = useState(initialNumberOfPeople);
  const [aadharNumbers, setAadharNumbers] = useState([]);
  const [verified, setVerified] = useState([]);

  const [showModal, setShowModal] = useState(false);  // Modal state
  const [otp, setOtp] = useState('');
  const [transactionIds, setTransactionIds] = useState([]);

  const [responseData, setResponseData] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    if (aadharNumber.length === 12) {
      try {
        setLoadingIndex(index); // Show loader
        const response = await axios.post(
          'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
          {
            aadhaar_number: aadharNumber,
            consent: 'Y',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'nZxozjbCqLfHpwyUAmsTEbZ7QWpHFbW1',
              'X-Auth-Type': 'API-Key',
            },
          }
        );

        if (response.data.status === 200 && response.data.data.code === '1001') {
          setTransactionIds((prev) => {
            const updatedTransactionIds = [...prev];
            updatedTransactionIds[index] = response.data.data.transaction_id;
            return updatedTransactionIds;
          });

          // Mark this user as verified
          setVerified((prev) => {
            const updatedVerified = [...prev];
            updatedVerified[index] = true;
            return updatedVerified;
          });

          alert('OTP successfully sent! Please check your mobile number.');
          setOtp('');
          setLoadingIndex(null);
          setShowModal(true);
          setSelectedIndex(index);
        } else {
          alert('Failed to generate OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying Aadhaar:', error);
        setLoadingIndex(null);
        alert(error.response?.data?.error?.message || 'Something went wrong.');
      }
    }
  };

  const handleSubmitOtp = async () => {
    if (selectedIndex === null) {
      alert("Please select a valid Aadhaar entry.");
      return;
    }

    const transactionId = transactionIds[selectedIndex];
    if (!transactionId) {
      alert("Transaction ID missing. Please generate OTP again.");
      return;
    }
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    const otpData = { otp: parseInt(otp, 10), share_code: '1234', include_xml: true };

    try {
      const response = await axios.post(
        "https://api.gridlines.io/aadhaar-api/boson/submit-otp",
        otpData,
        {
          headers: {
            'X-Auth-Type': 'API-Key',
            'X-Transaction-ID': transactionId,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-Key': 'nZxozjbCqLfHpwyUAmsTEbZ7QWpHFbW1',
          },
        }
      );

      if (response.status === 200) {
        alert("OTP verified successfully!");
        setResponseData((prevData) => {
          const updatedData = [...prevData];
          updatedData[selectedIndex] = response.data.data.aadhaar_data;
          return updatedData;
        });
        setShowModal(false); // Close modal after successful OTP verification
      } else {
        alert("OTP verification failed, please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.response.data.error.message);
      alert(error.response.data.error.message || "Something went wrong. Please try again.");
    }
  };

  const handleContinue = () => {
    if (!responseData) {
      alert("Please verify the OTP first.");
      return;
    }
    console.log(responseData.length !== aadharNumbers.length || responseData.some(data => !data));

    // if (responseData.length !== aadharNumbers.length || responseData.some(data => !data)) {
    //   alert("Please verify the OTP for all users first.");
    //   return;
    // }
    const verifiedCount = verified.filter((v) => v).length;

    navigate("/dashboard", { state: { verifiedCount, numberOfPeople, aadhaarData: responseData } });
  };

  const handleChangePeople = (action) => {
    setNumberOfPeople((prev) => {
      const newCount = action === "increase" ? prev + 1 : Math.max(0, prev - 1);
      return newCount;
    });
  };

  const handleDelete = (index) => {
    console.log("Deleting index: ", index);

    // Create a copy of the arrays
    const updatedAadharNumbers = [...aadharNumbers];
    const updatedVerified = [...verified];

    // Remove the element from both arrays using splice
    updatedAadharNumbers.splice(index, 1);
    updatedVerified.splice(index, 1);

    // Update the state
    setAadharNumbers(updatedAadharNumbers);
    setVerified(updatedVerified);

    // Decrease the number of people
    setNumberOfPeople((prev) => prev - 1);
  };


  return (
    <div className="relative flex flex-col items-center justify-start h-screen pt-10">
      <div className="absolute -mt-10 mr-32 right-4 flex">
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
        <div key={index} className="flex flex-row gap-4 relative w-full mb-4">
          <div className="relative border-2 ml-40 border-blue-500 rounded-full p-2 max-w-3xl w-full shadow-xl">
            <div className="flex items-center gap-4 w-full">
              <input
                type="text"
                placeholder={`Enter Aadhar Number for Person ${index + 1}`}
                value={aadhar}
                onChange={(e) => handleInputChange(index, e.target.value)}
                maxLength={14}
                className="flex-1 ml-6 p-3 rounded-full outline-none placeholder:text-gray-400 duration-300 border-0"
              />
              <button
                onClick={() => handleVerify(index)} // Ensure index is passed here as well
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
            onClick={() => handleDelete(index)} // Ensure index is passed here
            className="text-red-500 hover:text-red-700 transition duration-200"
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      ))}

      {/* OTP Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">OTP Verification</h2>
            <p className="text-gray-600 text-sm mb-4">
              Please enter the OTP sent to your registered mobile number.
            </p>

            {/* OTP Input */}
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleSubmitOtp()} // Pass index here to correctly use it in the function
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit OTP
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
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
          className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-800 transition duration-300"
          disabled={
            verified.filter((v) => v).length !== numberOfPeople
          }
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AadharVerify;
