import React, { useState } from "react";
import { FaClock, FaRupeeSign, FaCalendarAlt } from "react-icons/fa"; // Added FaCalendarAlt for calendar icon

const Wallet = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log("Search Query:", e.target.value); // You can use this for filtering or other search logic
  };

  // Sample transaction data
  const transactions = [
    { date: "2025-01-20", time: "14:30", status: "Done", amount: 1000 },
    { date: "2025-01-19", time: "09:15", status: "Not Done", amount: 500 },
    { date: "2025-01-18", time: "18:45", status: "Done", amount: 2000 },
  ];

  // Format date from yyyy-mm-dd to dd/mm/yyyy
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Calculate total balance
  const totalBalance = transactions.reduce((sum, transaction) => {
    return transaction.status === "Done" ? sum + transaction.amount : sum;
  }, 0);

  return (
    <div className="p-6 min-h-screen border-b border-gray-300">
      {/* Search Bar */}
      <div className="w-full mb-8">
        <input
          type="text"
          placeholder="Search User"
          className="w-full p-3 pl-4 pr-4 border border-gray-300 focus:outline-none rounded-full shadow-md text-gray-700 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)]"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Balance and Add Money */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-light text-gray-800">Your Balance</h1>
          <div className="flex items-center space-x-2 mt-2">
            <FaRupeeSign
              className="text-gray-700"
              style={{
                fontSize: "18px", // Slimmer by reducing font size slightly
                height: "28px", // Taller by increasing height
                lineHeight: "28px", // Aligns vertically
              }}
            />
            <span className="text-2xl text-gray-700">{totalBalance.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button className="bg-blue-700 text-white px-5 lg:mt-10 py-1 rounded-lg shadow-sm hover:bg-blue-600 text-sm ml-auto">
          Add Money
        </button>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white p-6 rounded shadow-sm pb-6">
        <h2 className="text-lg font-light mb-4 -ml-6 text-gray-800">Transaction History</h2>
        <div className="overflow-x-auto -ml-6">
          <table className=" -ml-4 table-auto w-full border-collapse text-gray-700">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 text-sm">Date & Time</th>
                <th className="px-4 py-2 text-sm">Status</th>
                <th className="px-4 py-2 text-sm">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-t border-b px-4 py-2 flex items-center space-x-2 text-sm">
                    <FaCalendarAlt className="text-gray-400" /> {/* Calendar icon */}
                    <span>{formatDate(transaction.date)}</span> {/* Formatted date */}
                    <FaClock className="text-gray-400" />
                    <span>{transaction.time}</span>
                  </td>
                  <td className="border-t border-b px-4 py-2 text-sm">{transaction.status}</td>
                  <td className="border-t border-b px-4 py-2 text-sm">
                    ₹{transaction.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
