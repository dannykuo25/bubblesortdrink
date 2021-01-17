import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Card.css';

class Card extends React.Component{
    constructor(props){
        super(props);
    }

}

const StateLesscard = (props) => ( // how to onclick and how to put everything in div in css
    <div className = "card">
        <div id ='storename'>{props.storename}</div>
        <div id = 'address'>{props.address}</div>
        <div id = 'storeids'>{props.storedis}</div>
            <button onClick = {props.onClick}>ORDER</button>
    </div>

)

export default StateLesscard;