import React from 'react';
import './styles/home.css';
import Sidebar from '../components/Home/sidebar';
import { Outlet } from 'react-router-dom';

const Home = () => {
    return (
        <div class="main-container">
           <div class="cont1" >
                <Sidebar />
           </div>
           <div class="cont2">
            <Outlet />
           </div>
        </div>
    );
};

export default Home;