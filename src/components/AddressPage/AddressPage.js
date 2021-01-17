import React, { Component, useRef, useState } from 'react';

import './AddressPage.css'
import { BrowserRouter, Route, Link } from "react-router-dom"
import BackgroundImage from '../common/BackgroundImage';

import Header from '../layout/Header';
import Alerts from '../layout/Alerts';

import { Spinner, Button } from 'react-bootstrap';

import Geocode from "react-geocode"



const AddressPage = () => {
  const [inputText, setInputText] = useState(' ')
  const [isLoading, setLoading] = useState(false);
  let inputRef = useRef(null);
  const handleInput = () => {
    setInputText(inputRef.current.value)
    console.log(inputText)
  }

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getAddress);
    } else {
      console.log("can't get location");
    }
  }

  const getAddress = (pos) => {
    setLoading(false);
    console.log(pos);
    Geocode.setApiKey("DummyKey");
    Geocode.setLanguage("en");
    Geocode.fromLatLng(pos.coords.latitude, pos.coords.longitude).then(
      response => {
        const address = response.results[0].formatted_address;
        console.log(address);
        setInputText(address)
        inputRef.current.value = address;
      },
      error => {
        console.error(error);
      }
    );

  }


  return (
    <>
      <Header />
      <Alerts />
      <div>
        <BackgroundImage />
        <form id='address_form'>
          <div className="description_text">
            <p>Order your authentic bubble tea online</p>
            <p>Add your location:</p>
          </div>
          <input type='text' id='user_address' ref={inputRef} onChange={handleInput} placeholder="STREET ADDRESS, CITY, STATE" />
          <span>{isLoading ?
            <Button onClick={getLocation}
              disabled={isLoading}
              id="getaddressbtn"
            >
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              /></Button> :
            <Button onClick={getLocation}
              disabled={isLoading}
              id="getaddressbtn"
            ><i class="fas fa-location-arrow"></i>  FIND MY LOCATION</Button>}
          </span>
          <div>
            <Link to={"/OrderPage/" + inputText}>
              <input type="submit" value="START ORDERING" id='submit_button' />
            </Link>
          </div>
        </form>
      </div>
    </>
  )




}
export default AddressPage