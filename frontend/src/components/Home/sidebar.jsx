import React, { useEffect, useState } from 'react';
//import '../styles/sidebar.css';
import 'components/styles/sidebar.css'
import { CgNotes } from 'react-icons/cg';
import { IoAlertCircleSharp } from 'react-icons/io5';
import { MdOutlineDoneOutline } from "react-icons/md";
import { TbNotebookOff } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
//import { authActions } from '../../store/auth.js';
import {authActions} from 'store/auth'
import { FaGlobe } from "react-icons/fa";
import axios from 'axios';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = [

        {
            title: "Tâches Publiques",
            icon: <FaGlobe />,
            link: "/public",
            
        }, 

        {
            title: "Mes Tâches",
            icon: <CgNotes />,
            link: "/",
            
        },
        {
            title: "Important",
            icon: <IoAlertCircleSharp />,
            link: "/important",
            
        },
        {
            title: "Complet",
            icon: < MdOutlineDoneOutline />,
            link: "/completed",
           
        },
        {
            title: "Incomplet",
            icon: <TbNotebookOff />,
            link: "/incomplete",
            
        },

        
    ];

    const [Data, setData] = useState();
    const [publicTasks, setPublicTasks] = useState([]);

    const logout = () => {  
        localStorage.clear("id");
        localStorage.clear("token");
        dispatch(authActions.logout());
        navigate("/login");
    }

    const headers = { id: localStorage.getItem("id"), authorization: `Bearer ${localStorage.getItem("token")}`, };
    useEffect(() => {
        const fetch = async () => {
        const response = await axios.get("http://localhost:1000/api/tache/get-all-tasks", {headers});
        setData(response.data.data);

        };
        fetch();
    } , []);

    useEffect(() => {
        const fetchPublicTasks = async () => {
            const response = await axios.get("http://localhost:1000/api/tache/get-public-tasks");
            setPublicTasks(response.data.data);
        };
        fetchPublicTasks();
    }, []);




    return (
        <>

            {Data && (

            <div class="sidebar-header">
                <h2>TÂCHES 3225</h2>
                <h4>Bonjour, {Data.username}</h4>
                <hr />
            </div>

            )}
            
            <div class="sidebar-content">
                {data.map((item, index) => (
                   <Link to={item.link} key={index} className="sidebar-item">
                   {item.icon}&nbsp;<span className="sidebar-text">{item.title}</span>
               </Link>
                ))}
            </div>
            <div>
                <button class="logout-button" onClick={logout}>Log out</button>
            </div>
        </>
    );
};

export default Sidebar;
