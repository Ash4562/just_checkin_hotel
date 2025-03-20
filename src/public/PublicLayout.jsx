import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';

const PublicLayout = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith("/dashboard");
    const isLoginOrRegisterPage = location.pathname === "/login" || location.pathname === "/register";


    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar (Always at the top) with higher z-index */}
            {!isLoginOrRegisterPage && <Navbar />}
            <div className="flex flex-1">
                {/* Sidebar for Dashboard (display as navbar on small screens) */}
                {isDashboard && (
                    <div className="flex   sm:flex-row flex-col z-40">
                        {/* Sidebar for larger screens */}
                        <Sidebar />
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:ml-0 ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PublicLayout;
