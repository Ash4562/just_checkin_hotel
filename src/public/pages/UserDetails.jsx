import React, { useState, useEffect } from 'react';
import { useGetBookingsQuery } from '../../redux/api/BookingAPI';

function UserDetails() {
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, error, isLoading } = useGetBookingsQuery();

    const bookings = data?.bookings || [];

    useEffect(() => {
        console.log('Fetched Bookings:', bookings);
    }, [bookings]);

    console.log(error);


    useEffect(() => {
        if (selectedUser) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [selectedUser]);

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen text-xl font-semibold">
                Loading...
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center h-screen text-red-500 text-lg font-medium">
                {error.data.message || "Error fetching users"}
            </div>
        );


    return (
        <>
            <div className="w-full mt-20 lg:-mt-0 relative sticky top-0 bg-white z-10">
                <input
                    type="text"
                    placeholder="Search User"
                    className="w-full p-3 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none shadow"
                />
            </div>

            <div className="flex sm:mt-0">
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto">
                        <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {bookings.map((booking) =>
                                booking.customers.map((user) => (
                                    <div
                                        key={user._id}
                                        onClick={() =>
                                            setSelectedUser(
                                                selectedUser?.id === user._id
                                                    ? null
                                                    : user
                                            )
                                        }
                                        className={`w-full -mt-2 h-auto py-2 rounded-3xl ${selectedUser?.id === user._id
                                            ? 'bg-white shadow-[0_6px_15px_rgba(0,0,0,0.6)]'
                                            : 'bg-[#ecf8f9] shadow-md'
                                            } flex flex-col items-center my-4 justify-center space-y-4 cursor-pointer hover:shadow-sm border-black transition duration-300`}
                                    >
                                        <img
                                            src={user.aadhar_image || '/GroupPhoto.png'}
                                            className="w-22 h-18 object-cover"
                                            alt="User"
                                        />
                                        <div className="text-center">
                                            <h1 className="text-sm text-gray-800">{user.customer_name}</h1>
                                            <p className="text-sm text-gray-600">Aadhar Number</p>
                                            <p className="text-sm text-gray-600">{user.aadhar_number}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {selectedUser && (
                        <div
                            className="w-full hidden lg:block sm:w-[34%] shadow-[0_6px_15px_rgba(0,0,0,0.4)] px-16 p-8 py-2 rounded-2xl bg-white lg:mr-14 fixed right-0 top-0 h-[67%] mb-2 z-20 mt-60 md:mt-28 md:-ml- lg:mt-48 overflow-y-auto"
                        >
                            <div className="text-center">
                                <img
                                    src={selectedUser.aadhar_image || '/Vector.svg'}
                                    alt="User Profile"
                                    className="w-14 h-14 p-2 bg-[#85d200] rounded-full mx-auto"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mt-2">{selectedUser.customer_name}</h3>
                            </div>

                            <ul className="text-gray-500">
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Aadhar Number:</label>
                                    <span className="text-right">{selectedUser.aadhar_number}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Phone:</label>
                                    <span>{selectedUser.phone_number}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Address:</label>
                                    <span>{selectedUser.address}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Gender:</label>
                                    <span>{selectedUser.gender}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Room Number:</label>
                                    <span>{selectedUser.room_number}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <label className="font-semibold w-1/2 text-left">Check-Out Time:</label>
                                    <span className="text-right">{selectedUser.check_out_time}</span>
                                </li>
                            </ul>

                            <div className="text-center   mt-20 ml-4 flex justify-center space-x-4">
                                <button
                                    className="w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center"
                                    onClick={() => setSelectedUser(null)} // Close the user details panel
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedUser && (
                        <div
                            className="w-full mt-60 sm:w-[75%] md:w-[50%] lg:w-[34%] shadow-[0_6px_15px_rgba(0,0,0,0.4)] px-6 sm:px-10 md:px-16 py-6 sm:py-8 rounded-2xl bg-white fixed right-0 top-0 h-[90%] sm:h-[80%] md:h-[75%] lg:h-[67%] z-20 overflow-y block xl:hidden"
                        >
                            <div className="absolute top-10 right-4">
                                <button
                                    className="w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    X
                                </button>
                            </div>

                            <div className="text-center">
                                <img
                                    src={selectedUser.aadhar_image || '/Vector.svg'}
                                    alt="User Profile"
                                    className="w-14 h-14 p-2 bg-[#85d200] rounded-full mx-auto"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl sm:text-2xl font-bold mt-4">{selectedUser.customer_name}</h3>
                            </div>

                            <ul className="text-gray-500 mt-6 space-y-3">
                                {[{ label: 'Aadhar Number', value: selectedUser.aadhar_number },
                                { label: 'Phone', value: selectedUser.phone_number },
                                { label: 'Address', value: selectedUser.address },
                                { label: 'Gender', value: selectedUser.gender },
                                { label: 'Room Number', value: selectedUser.room_number },
                                { label: 'Check-In Time', value: selectedUser.check_in_time },
                                { label: 'Check-Out Time', value: selectedUser.check_out_time }].map((item, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <label className="font-semibold w-1/2 text-left">{item.label}:</label>
                                        <span className="text-right">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default UserDetails;
