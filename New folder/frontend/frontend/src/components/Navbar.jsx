import React from 'react'

import LOGO from '../assets/OrdermadeWhite.png'

const Navbar = () => {
    return (
        <div className='bg-viridian flex intems-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <img className='flex items-center gap-2'/>

            <ProfileInfo userInfo={userInfo} />
        </div>
        );
    };

export default Navbar;