import React from 'react';

const PortfolioCard = ({ 
    imgURL, 
    title, 
    description, 
    onClick, 
}) => {
    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer w-full sm:w-80 md:w-96">
            {/* Ensure fallback image if imgUrl is not available */}
            <img
                src={imgURL || "/default-image.jpg"}  // Fallback image if imgUrl is empty
                alt={title}
                className="w-full h-48 object-cover rounded-lg"
                onClick={onClick}
            />
            <div className="p-4" onClick={onClick}>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        {/* Title */}
                        <h6 className="text-sm font-medium text-gray-800">{title}</h6>
                        {/* Description */}
                        <p className="text-xs text-gray-500 truncate">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioCard;
