import React from 'react';
import { IoAddCircleSharp, IoAlertCircleSharp, IoAlertCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { GoPencil } from "react-icons/go";
import { FaGlobe } from "react-icons/fa";
import axios from 'axios';
import '../styles/taches.css';

const Taches = ({home, setVisibility, data, setUpdatedData, showButtons = true }) => {
    const headers = { id: localStorage.getItem("id"), authorization: `Bearer ${localStorage.getItem("token")}`, };

    const handleCompleteTask = async (id) => {
        try {
            const response = await axios.put(`http://localhost:1000/api/tache/update-cmp-task/${id}`, {}, {headers});
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleImportant = async (id) => {
        try {
            const response = await axios.put(`http://localhost:1000/api/tache/update-imp-task/${id}`, {}, {headers});
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTask = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:1000/api/tache/delete-task/${id}`, {headers});
            console.log(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = (id, title, description, isPublic) => {
        setVisibility("fixed");
        setUpdatedData({id: id, title: title, description: description, isPublic: isPublic});
    }

    return (
        <div className="taches-container">
            {data &&
                data.map((item, index) => (
                    <div key={index} className="card">
                        <div>
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-description">{item.description}</p>
                            {item.isPublic && <FaGlobe />}
                            <p className="card-date">Publié le: {new Date(item.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <div className="card-footer">
                            <button 
                                className={`status-button ${item.complete === false ? 'status-incomplete' : 'status-complete'}`} 
                                onClick={() => handleCompleteTask(item._id)}
                                disabled={showButtons ? false : true}
                            >
                                {item.complete === true ? 'Complet' : 'Incomplet'}
                            </button>

                            <div className="icon-container">
                                <button className="icon-button" onClick={() => handleImportant(item._id)} disabled={showButtons ? false : true}>
                                    {item.important === false ? (<IoAlertCircleOutline />) : (<IoAlertCircleSharp />)}
                                </button>
                                {showButtons && (
                                    <>
                                        <button className="icon-button" onClick={() => handleUpdate(item._id, item.title, item.description, item.isPublic)}><GoPencil/></button>
                                        <button className="icon-button" onClick={() => deleteTask(item._id)}><MdDeleteOutline /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            {home === "true" && ( 
                <button className="card add-task" onClick={() => setVisibility("fixed")}>
                    <IoAddCircleSharp className="add-icon" />
                    <h2 className="add-task-text">Ajouter</h2>
                </button>
            )}
        </div>
    );
};

export default Taches;
