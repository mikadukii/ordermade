import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, ChevronLeft, ChevronRight, LogOut } from 'react-feather'; // Ensure these icons are installed and imported correctly

const AdminSidebar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // Define `isExpanded` state
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Create Services", path: "/admin/create-services" },
        { name: "Edit Services", path: "/admin/edit-services" },
        { name: "Add Portfolio", path: "/admin/add-portfolio" },
        { name: "Manage Users", path: "/admin/manage-users" },
        { name: "Manage Requests", path: "/admin/manage-requests" },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const ToggleButton = () => (
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
                absolute -right-3 top-1/2 -translate-y-1/2
                w-6 h-12
                bg-gray-800 text-white rounded-l-md
                transition-all duration-200
                shadow-lg
            `}
            data-testid="toggle-sidebar"
        >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
    );

    return (
        <>
            {/* Sidebar for Mobile Navigation */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 text-black p-4 z-50">
                <div className="flex justify-between items-center">
                    <button
                        className="text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-gray-800 text-white p-4 z-50">
                    <div className="fixed right-0 top-0 h-full w-64 bg-gray-800 p-4 shadow-lg z-50">
                        <nav className="flex-1 mt-16">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        block p-2 rounded-md text-white 
                                        hover:bg-gray-700 
                                        ${location.pathname === item.path ? 'bg-gray-700 text-black' : ''}
                                    `}
                                >
                                    <span className="ml-4 text-sm">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div
                className={`
                    hidden lg:flex flex-col h-screen bg-gray-800 text-white p-4 shadow-lg
                    transition-transform duration-200 ease-in-out
                    ${isExpanded ? 'w-64' : 'w-16'}
                `}
            >
                <div className="relative border-b border-gray-700 pb-4 mb-4">
                    <h1 className={`text-white font-bold text-xl ${isExpanded ? 'block' : 'hidden'}`}>OrderMade</h1>
                    <ToggleButton />
                </div>

                <nav className="flex-1 mt-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            data-testid={item.testid}
                            className={`
                                flex items-center p-2 rounded-md text-white 
                                hover:bg-gray-700 
                                ${location.pathname === item.path ? 'bg-gray-700 text-black' : ''}
                                ${isExpanded ? 'justify-start' : 'justify-center'}
                                group relative
                            `}
                        >
                            <span className="ml-4 text-sm">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center p-2 rounded-md text-white 
                        hover:bg-gray-700 
                        ${isExpanded ? 'justify-start' : 'justify-center'}
                        group relative
                    `}
                    data-testid="logout-button"
                >
                    <LogOut className="w-5 h-5" />
                    {isExpanded && <span className="ml-4 text-sm">Logout</span>}
                </button>
            </div>
        </>
    );
};

export default AdminSidebar;