import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';


const AdminLayout = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return(
        <div className="flex min-h-screen relative">

        {/*content*/}
        <div className="flex w-full min-h-screen relative z-10">
            <AdminSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div className={`flex-1 transition-all duration-200 ease-in-out 
                ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
                    <div className="h-16 lg:hidden"/>
                    <main className="p-4 lg:p-6 w-full max-w- [1400px] mx-auto">
                <Outlet />
            </main>
        </div>
        </div>
        </div>

    );
};

export default AdminLayout;