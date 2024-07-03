import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div>
            {!token && (
                <div className='flex'>
                    <button onClick={() => navigate("/signup")} className='border rounded p-4 mr-2'>Sign up</button>
                    <button onClick={() => navigate("/signin")} className='border rounded p-4 mr-2'>Sign in</button>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
