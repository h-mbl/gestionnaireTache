import React from 'react';
import { Link } from 'react-router-dom';
//import './styles/Login.css';
import 'pages/styles/Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { authActions } from '../store/auth';
import { authActions } from 'store/auth';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const [Data, setData] = useState({username: "", password: ""});
    const history = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    if (isLoggedIn) {
        history("/");
    }
    const dispatch = useDispatch();
    const change = (e) => { 
        const {name, value} = e.target;
        setData({...Data, [name]: value
    });

};
    const submit = async () => { 
        if (Data.username === "" || Data.password === "") {
            alert("Veuillez remplir tous les champs");
        } else {
            try {
                const response = await axios.post("http://localhost:1000/api/user/log-in", Data);
                setData({username: "", password: ""});
                localStorage.setItem("id", response.data.id);
                localStorage.setItem("token", response.data.token);
                dispatch(authActions.login());
                history("/");
            
                
            } catch (error) {
                alert(error.response.data.message);
            
        }
 
    }
};
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">Connexion</div>
                <input
                    type="text"
                    placeholder="pseudo"
                    className="login-input"
                    name="username"
                    value={Data.username}
                    onChange={change}
                    required
                />
                <input
                    type="password"
                    placeholder="mot de passe"
                    className="login-input"
                    name="password"
                    value={Data.password}
                    onChange={change}
                    required
                />
                <div className="login-footer">
                    <button className="login-button" onClick={submit}>Connexion</button>
                    <Link to="/signup" className="signup-link">Pas de compte ? Inscrivez vous !</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
