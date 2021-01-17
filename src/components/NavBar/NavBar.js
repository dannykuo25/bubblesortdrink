import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom"
import './NavBar.css';
import icon from '../Assets/bubble-tea-icon.png';


const NavBar = (props) => (
    <div id = 'navbar'>
        <Link to="/">
        <img src={icon} alt="icon" id='iconpic'></img> 
        <div id='username'>{props.username}</div>
        </Link>
    </div>

)
export default NavBar;