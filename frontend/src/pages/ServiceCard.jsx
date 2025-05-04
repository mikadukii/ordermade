import React from 'react';


const ServicesCard = ({ 
    imgURL, 
    title,
    description,
    onClick, 
}) => {
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all ease-in-out relative cursor-pointer">
            <img
                src={imgURL}
                alt={title}
                className="w-full h-56 object-cover rounded-t-lg"
                onClick={onClick}
            />
            <div className="p-6">
                <h5 className="text-lg font-medium text-slate-800">{title}</h5>
                <p className="text-sm text-slate-500 mt-2">{description}</p>

                <div className="flex justify-end mt-4">
                    <button 
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition duration-200"
                        onClick={onClick}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServicesCard;

