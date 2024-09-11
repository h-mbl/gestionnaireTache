import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'pages/styles/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'store/auth';
import ImageZoom from 'components/Home/ImageZoom';
import sc1 from 'assets/sc1.png';
import sc2 from 'assets/sc2.png';
import sc3 from 'assets/sc3.png';
import sc4 from 'assets/sc4.png';
import sc5 from 'assets/sc5.png';
import sc6 from 'assets/sc6.png';

const Login = () => {
    // Variable d'état pour gérer l'état de maintenance
    const [isMaintenance, setIsMaintenance] = useState(true); // Mettre à true pour activer la maintenance
    const [Data, setData] = useState({ username: "", password: "" });
    const history = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    if (isLoggedIn) {
        history("/");
    }

    const dispatch = useDispatch();

    const change = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
    };

    const submit = async () => {
        if (Data.username === "" || Data.password === "") {
            alert("Veuillez remplir tous les champs");
        } else {
            try {
                const response = await axios.post("http://localhost:1000/api/user/log-in", Data);
                setData({ username: "", password: "" });
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
        <div>
            {isMaintenance ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h1>🚧 Site en Maintenance 🚧</h1>
                    <p>
                        La plateforme est actuellement en maintenance en raison de la configuration des chemins d'accès sur le serveur d'hébergement.
                    </p>
                    <p>
                        En attendant, si vous souhaitez explorer le code source ou utiliser la plateforme localement, vous pouvez <strong>forker</strong> le repository directement depuis GitHub à l'adresse suivante :
                    </p>
                    <p>
                        <a href="https://github.com/h-mbl/gestionnaireTache" target="_blank" rel="noopener noreferrer">
                            <u><strong>Forker le repository sur GitHub</strong></u>
                        </a>
                    </p>
                    <br />
                    <p>
                        Voici quelques photos de la plateforme pour vous donner un aperçu :
                    </p>
                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px'}}>
                        <ImageZoom src={sc1} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                        <ImageZoom src={sc2} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                        <ImageZoom src={sc3} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                        <ImageZoom src={sc4} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                        <ImageZoom src={sc5} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                        <ImageZoom src={sc6} alt="Aperçu 1" style={{borderRadius: '8px'}}/>
                    </div>
                    <p>
                        Merci de votre compréhension ! 😊
                    </p>
                    <br/>
                    <h2>🔧<strong> Instructions d'Installation</strong> 🔧</h2>
                    <br/>
                    <p>
                        Suivez ces étapes pour installer et lancer l'application localement :
                    </p>
                    <ol style={{ textAlign: 'left', margin: '0 auto', display: 'inline-block' }}>
                        <li><strong>Clonez le repository :</strong> <code>git clone https://github.com/h-mbl/gestionnaireTache.git</code></li>
                        <li><strong>Accédez au répertoire du projet :</strong> <code>cd gestionnaireTache</code></li>
                        <li><strong>Installez les dépendances :</strong> <code>npm run install-all</code></li>
                        <li><strong>Construisez le frontend :</strong> <code>npm run build</code></li>
                        <li><strong>Lancez l'application en mode développement :</strong> <code>npm run dev</code></li>
                        <li><strong>Lancez le backend en mode développement :</strong> <code>npm run dev-backend</code></li>
                        <li><strong>Lancez le frontend en mode développement :</strong> <code>npm run dev-frontend</code></li>
                    </ol>
                </div>
            ) : (
                <div className="login-container">
                    <div className="login-box">
                        <div className="login-header">Connexion 🔑</div>
                        <input
                            type="text"
                            placeholder="Pseudo"
                            className="login-input"
                            name="username"
                            value={Data.username}
                            onChange={change}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="login-input"
                            name="password"
                            value={Data.password}
                            onChange={change}
                            required
                        />
                        <div className="login-footer">
                            <button className="login-button" onClick={submit}>Connexion</button>
                            <Link to="/signup" className="signup-link">Pas de compte ? Inscrivez-vous !</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
