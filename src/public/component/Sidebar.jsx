import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="p-5 shadow-sm    border-b border-black    sm:shadow-2xl w-full fixed sm:relative z-50 sm:flex sm:flex-col flex-row bg-white sm:bg-white"> {/* Added sm:bg-white */}
        {/* Sidebar Content */}
        <nav className="flex sm:flex-col flex-row items-center justify-start sm:items-center sm:space-y-5 space-x-11">
            {/* Add User Button */}
            <NavLink
                to="/dashboard/DashboardFirst"
                end
                className={({ isActive }) =>
                    `px-6 py-2 rounded-md sm:flex sm:ml-10 items-center gap-3 transition duration-300 shadow-lg ${isActive
                        ? 'bg-[#85D200] text-white'
                        : 'bg-white text-black hover:bg-[#85D200] hover:text-white'
                    }`
                }
            >
                <img
                    src="/Adduser.png"
                    alt="Add User"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 object-cover"
                />
                <span className="text-base">Add Users</span>
            </NavLink>
    
            {/* User Details Button */}
            <NavLink
                to="/dashboard/userdetails"
                end
                className={({ isActive }) =>
                    `px-6 py-2 rounded-md sm:flex items-center gap-3 transition duration-300 shadow-lg ${isActive
                        ? 'bg-[#85D200] text-white'
                        : 'bg-white text-black hover:bg-[#85D200] hover:text-white'
                    }`
                }
            >
                <img
                    src="/userdetails.png"
                    alt="User Details"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />
                <span className="text-base">User Details</span>
            </NavLink>
    
            {/* Your Profile Button */}
            <NavLink
                to="/dashboard/profile"
                end
                className={({ isActive }) =>
                    `px-6 py-2 rounded-md sm:flex items-center gap-3 transition duration-300 shadow-lg ${isActive
                        ? 'bg-[#85D200] text-white'
                        : 'bg-white text-black hover:bg-[#85D200] hover:text-white'
                    }`
                }
            >
                <img
                    src="/yourprofile.png"
                    alt="Your Profile"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                />
                <span className="text-base">Your Profile</span>
            </NavLink>
        </nav>
    </aside>
    
    );
};

export default Sidebar;
