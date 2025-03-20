import React, { useEffect, useState } from "react";
import userprofile from "/userprofile.jpg";
import { useGetSingleHotelQuery } from "../../redux/api/hotelProfileApi";
import { useNavigate } from "react-router-dom";
import { useLogoutHotelMutation } from "../../redux/api/AuthAPI";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { data, isLoading, isError, error } = useGetSingleHotelQuery();

  const [LogoutHotel, { isSuccess }] = useLogoutHotelMutation();

  const handleLogout = () => {
    LogoutHotel();
    localStorage.removeItem("token");
    
    // Show success toast on logout
    toast.error("🎉 Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    navigate("/login");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error: {error?.data?.message || "Something went wrong"}</p>;
  }


  return (
    <div className="flex flex-col md:flex-row mt-36 sm:mt-0">
      {/* Left Image Section */}
      <div className="flex-1 -mb-6">
        <img
          src={userprofile} // Replace with dynamic image source if available
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Profile Section */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 overflow-auto">
        {/* Profile Picture */}
        <div className="flex gap-4 lg:-ml-16 items-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-gray-500 text-2xl md:text-3xl"></i>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              {data?.hotelName || "Hotel Name"}
            </h1>
            <p className="text-gray-500">{data?.hotelAddress || "Location"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={data?.email || ""}
              className="border-b border-gray-300 w-full px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              readOnly
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              value={data?.phone || ""}
              className="border-b border-gray-300 w-full px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              readOnly
            />
          </div>

      

          <div className="mb-4">
            <input
              type="text"
              value={data?.gstNo || ""}
              className="border-b border-gray-300 w-full px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              readOnly
            />
          </div>

          <div className="mb-4 flex items-center border-b border-gray-300">
            <input
              type="text"
              value={data?.hotelDocument || ""}
              className="w-full px-4 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
              readOnly
            />
            <button
              onClick={openModal}
              className="bg-blue-500 text-white px-4 rounded-full ml-2"
            >
              View
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 w-full mt-5 text-white px-6 py-2 rounded-full hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Document Preview</h2>
            {/* Check if hotelDocument is a valid URL and display the image */}
            {data?.hotelDocument ? (
              <img
                src={data.hotelDocument}
                alt="Hotel Document"
                className="w-full h-80 rounded-lg"
              />
            ) : (
              <p>No document available.</p>
            )}
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;













