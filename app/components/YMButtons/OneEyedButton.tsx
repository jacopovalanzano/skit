import React from "react";

interface OneEyedButtonProps {
    handleClick: () => void;
}

const OneEyedButton: React.FC<OneEyedButtonProps> = ({ handleClick }) => {
    return (
        <div className="flex flex-row items-center justify-center">
            <button
                onClick={handleClick}
                className="flex flex-row items-center justify-center px-1 py-0.5 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition"
            >
                <svg height="17" width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ffffff">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                </svg>
            </button>
        </div>
    );
};

export default OneEyedButton;
