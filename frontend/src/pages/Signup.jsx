import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useSelector} from 'react-redux';


const Signup = () => {
    const history = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    if (isLoggedIn) {
        history("/");
    }
    const [Data, setData] = useState({username: "", email: "", password: ""});
    
    const change = (e) => { 
        const {name, value} = e.target;
        setData({...Data, [name]: value
    });

};
    const submit = async () => { 
        if (Data.username === "" || Data.email === "" || Data.password === "") {
            alert("Veuillez remplir tous les champs");
        } else {
            try {
                const response = await axios.post("http://localhost:1000/api/user/sign-up", Data);
                setData({username: "", email: "", password: ""});
                alert(response.data.message);
                history("/login");
                
            } catch (error) {
                alert(error.response.data.message);
        }
 
    }
};
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">Inscription</div>
                <form onSubmit={{submit}}>

                <input
                    type="username"
                    placeholder="pseudo"
                    className="login-input"
                    name="username"
                    required
                    onChange={change}
                    value={Data.username}
                />
                <input
                    type="email"
                    placeholder="adresse email"
                    className="login-input"
                    name="email"
                    required
                    onChange={change}
                    value={Data.email}
                />
                <input
                    type="password"
                    placeholder="mot de passe"
                    className="login-input"
                    name="password"
                    required
                    onChange={change}
                    value={Data.password}
                />
                 
                </form>
                <div className="login-footer">
                <button 
                    className="login-button"
                    onClick={submit}>
                    S'inscrire</button>
                <Link to="/login" className="signup-link">Vous avez déja un compte ? Connectez vous !</Link>
                
            </div>
            </div>
        </div>
    );
};

export default Signup;
