import React, { useState, useEffect } from 'react';
//import Tache from '../components/Home/taches';
import Tache from 'components/Home/taches';
import { IoAddCircleSharp } from 'react-icons/io5';
//import Input from '../components/Home/input';
import Input from 'components/Home/input';
//import SearchTasks from '../components/Home/searchTasks';
import SearchTasks from 'components/Home/searchTasks';
//import './styles/mytasks.css';
import 'pages/styles/mytasks.css';

import axios from 'axios';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
//import useDebounce from '../components/Home/useDebounce';
import useDebounce from 'components/Home/useDebounce';

const MyTasks = () => {
    const [Visibility, setVisibility] = useState("hidden");
    const [Data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [updatedData, setUpdatedData] = useState({ id: "", title: "", description: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, 200);

    const calculateTasksPerPage = (width) => {
        if (width < 500) return 2;
        if (width < 850) return 2;
        if (width < 1200) return 8;
        return 19;
    };

    const [tasksPerPage, setTasksPerPage] = useState(calculateTasksPerPage(window.innerWidth));

    const headers = { id: localStorage.getItem("id"), authorization: `Bearer ${localStorage.getItem("token")}`, };

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get("http://localhost:1000/api/tache/get-all-tasks", { headers });
            setData(response.data.data.tasks);
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

    useEffect(() => {
        const handleSearch = async () => {
            if (debouncedSearchQuery.trim() === "") {
                setSearchResults(null);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:1000/api/tache/search-tasks?query=${debouncedSearchQuery}`, { headers });
                setSearchResults(response.data.data);
            } catch (error) {
                console.error("Error searching tasks: ", error);
            }
        };

        handleSearch();
    }, [debouncedSearchQuery]);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = (searchResults || Data).slice(indexOfFirstTask, indexOfLastTask);

    const totalPages = Math.ceil((searchResults ? searchResults.length : Data.length) / tasksPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <> 
            <div>
                <div className='top-bar'>
                    <h1>Mes Tâches</h1>
                    <div className='pagination'>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="prev-next"><IoIosArrowBack/></button>
                    <span className="numbering">Page {currentPage} de {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="prev-next"><IoIosArrowForward/></button>
                </div>
                    <SearchTasks onSearch={setSearchQuery} /> 
                </div>
                <Tache home={"true"} setVisibility={setVisibility} data={currentTasks} setUpdatedData={setUpdatedData} />
                
            </div>
            <Input Visibility={Visibility} setVisibility={setVisibility} updatedData={updatedData} setUpdatedData={setUpdatedData} />
        </>
    );
};

export default MyTasks;
