import React, { useEffect, useInsertionEffect } from 'react';
import './App.css';
import Home from './pages/home';
import { 
  Routes, 
  Route, 
  useNavigate } from 'react-router-dom';
import MyTasks from './pages/mytasks';
import Important from './pages/Important';
import Completed from './pages/Completed';
import Incomplete from './pages/Incomplete';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Public from './pages/public';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';



const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {

    if (localStorage.getItem('token') && localStorage.getItem('id')) {
      dispatch(authActions.login());
    } else if (!isLoggedIn) {
      navigate('/login');
    }
  }
  , []);
      
  return (
	<div class="server-container">
      <Routes>
        <Route exact path="/" element={<Home />} >
          <Route index element={<MyTasks />} />
          <Route path="/important" element={<Important />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/incomplete" element={<Incomplete />} />
          <Route path="/public" element={<Public />} />
        </Route> 
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
	</div>
  );
};

export default App;