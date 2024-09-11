import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
//import '../styles/input.css';
import 'components/styles/input.css'
import axios from 'axios';

const Input = ({ Visibility, setVisibility, updatedData, setUpdatedData }) => {
    const isVisible = Visibility !== "hidden";

    const [Data, setData] = useState({ title: "", description: "", isPublic: false });
    const [isPublic, setIsPublic] = useState(Data.isPublic);

    useEffect(() => {
        if (isVisible && updatedData.id) {
            setData({ title: updatedData.title, description: updatedData.description, isPublic: updatedData.isPublic });
            setIsPublic(updatedData.isPublic);
        } else if (isVisible && !updatedData.id) {
            setData({ title: "", description: "", isPublic: false });
            setIsPublic(false);
        }
    }, [isVisible, updatedData]);

    const headers = { id: localStorage.getItem("id"), authorization: `Bearer ${localStorage.getItem("token")}` };

    const change = (e) => {
        const { name, type, value, checked } = e.target;
        setData({ ...Data, [name]: type === 'checkbox' ? checked : value });
        if (name === 'isPublic') {
            setIsPublic(checked);
        }
    };

    const handlePublicChange = async (e) => {
        const newPublicStatus = e.target.checked;
        setData({ ...Data, isPublic: newPublicStatus });
        setIsPublic(newPublicStatus);

        if (updatedData.id) {
            try {
                await axios.put(`http://localhost:1000/api/tache/update-public-task/${updatedData.id}`, { isPublic: newPublicStatus }, { headers });
                setUpdatedData({ ...updatedData, isPublic: newPublicStatus });
            } catch (error) {
                console.error("Error updating public status:", error);
                alert("Failed to update public status.");
            }
        }
    };

    const submitData = async () => {
        if (Data.title === "" || Data.description === "") {
            alert("Veuillez remplir tous les champs");
        } else {
            try {
                await axios.post("http://localhost:1000/api/tache/create-task", Data, { headers });
                setData({ title: "", description: "", isPublic: isPublic });
                setVisibility("hidden");
            } catch (error) {
                console.error("Error creating task:", error);
                alert("Failed to create task.");
            }
        }
    };

    const updateTask = async () => {
        if (Data.title === "" || Data.description === "") {
            alert("Veuillez remplir tous les champs");
        } else {
            try {
                setIsPublic(Data.isPublic);
                await axios.put(`http://localhost:1000/api/tache/update-task/${updatedData.id}`, Data, { headers });
                setUpdatedData({ ...updatedData, ...Data });
                setVisibility("hidden");
            } catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update task.");
            }
        }
    };

    return (
        <>
            <div className={`${isVisible ? "overlay" : "hidden"}`}></div>
            <div className={`${isVisible ? "centered" : "hidden"}`}>
                <div className='modal'>
                    <div className="flex-end">
                        <button className="close-button" onClick={() => {
                            setVisibility("hidden");
                            setData({ title: "", description: "", isPublic: false });
                            setIsPublic(false);
                            setUpdatedData({ id: "", title: "", description: "", isPublic: false });
                        }} >
                            <RxCross2 />
                        </button>
                    </div>
                    <input 
                        type="text" 
                        placeholder='Titre'
                        name="title" 
                        className="input" 
                        value={Data.title}
                        onChange={change}
                    />
                    <textarea 
                        name='description'
                        cols='30'
                        rows='10'
                        placeholder='Contenu...'
                        className='textarea'
                        value={Data.description}
                        onChange={change}
                    ></textarea>
                    <div className='flex'>
                    <label className="checkbox-label">
                        <input
                            className="checkbox"
                            type="checkbox"
                            name="isPublic"
                            checked={isPublic ? "checked" : ""}
                            onChange={handlePublicChange}
                        />
                        <span className="check-span">Publier</span>
                    </label>
                    {updatedData.id === "" ?  
                        <button className='add-button' onClick={submitData}>Ajouter</button> :  
                        <button className='add-button' onClick={updateTask}>Modifier</button>
                    }

                    </div>
                </div>
            </div>
        </>
    );
};

export default Input;
