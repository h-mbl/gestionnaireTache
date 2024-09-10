import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tache from '../components/Home/taches';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './styles/topBar.css';

const Incomplete = () => {
    const [Data, setData] = useState([]); // Initialize with an empty array
    const [updatedData, setUpdatedData] = useState({ id: "", title: "", description: "" });
    const [Visibility, setVisibility] = useState("hidden");
    const [currentPage, setCurrentPage] = useState(1);

    const calculateTasksPerPage = (width) => {
        if (width < 500) return 2;
        if (width < 850) return 2;
        if (width < 1200) return 8;
        return 19;
    };

    const [tasksPerPage, setTasksPerPage] = useState(calculateTasksPerPage(window.innerWidth));

    const headers = { id: localStorage.getItem("id"), authorization: `Bearer ${localStorage.getItem("token")}` };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get("http://localhost:1000/api/tache/get-incmp-tasks", { headers });
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching incomplete tasks: ", error);
            }
        };
        fetch();
    }, [headers]);

    useEffect(() => {
        const handleResize = () => {
            setTasksPerPage(calculateTasksPerPage(window.innerWidth));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = Data.slice(indexOfFirstTask, indexOfLastTask);

    const totalPages = Math.ceil(Data.length / tasksPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <>
            <div className='top-bar'>
                <h1>Incomplet</h1>
                <div className='pagination'>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="prev-next">
                        <IoIosArrowBack />
                    </button>
                    <span className="numbering">Page {currentPage} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="prev-next">
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
            <div>
                <Tache home={"false"} setVisibility={setVisibility} data={currentTasks} setUpdatedData={setUpdatedData} showButtons={false} />
            </div>
        </>
    );
};

export default Incomplete;
