import React,{ Component, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './MapPage.css';
import Card from '../Card/Card';
import GoogleMapReact, { convertNeSwToNwSe } from 'google-map-react'
import { debounce } from 'lodash' // for debounce

import Header from '../layout/Header';
import Alerts from '../layout/Alerts';
// import 'google-distance';

const API_KEY = "DummyKey";

// var distance = require('google-distance');
 
// distance.get(
//   {
//     origin: 'San Francisco, CA',
//     destination: 'San Diego, CA'1/-460
//   },
//   function(err, data) {
//     if (err) return console.log(err);
//     console.log(data);
// });

const AnyReactComponent = ({ text }) => (<div>{text}</div>)

const Marker = ({ icon, text }) => ( // use Marker to pin/display each location on the Google Map
    <div>
      <img style={{ height: '30px', width: '30px' }} src={icon} />
      <div>{text}</div>
    </div>
  )

  const SimpleMap = (props) => {
    const input_address = props.match.params.address;
   
    const [mapApiLoaded, setMapApiLoaded] = useState(false)
    const [mapInstance, setMapInstance] = useState(null)
    const [mapApi, setMapApi] = useState(null)
    const [myPosition, setMyPosition] = useState({
      lat: 40.4517272,
      lng: -79.933525
      })
    const [places, setPlaces] = useState([])
    const [inputText, setInputText] = useState('')
    const handleApiLoaded = (map, maps) => {
        setMapInstance(map)
        setMapApi(maps)
        setMapApiLoaded(true)
    };
    const [autocompleteResults, setAutocompleteResults] = useState([])
    const [currentCenter, setCurrentCenter] = useState({
      lat: 40.4517272,
      lng: -79.933525
    })
    const findLocation = () => {
        if(mapApiLoaded) {
          const service = new mapApi.places.PlacesService(mapInstance)

          const request = {
            location: myPosition,
            radius: 700,
            type: ['cafe'],
            keyword: ['bubble']
          };
    
          service.nearbySearch(request, (results, status) => {
            if(status === mapApi.places.PlacesServiceStatus.OK) {
              // console.log(results)
              setPlaces(results)
            }
          })
        }
      }


      //------------------------ auto complete
      let inputRef = useRef(null);
      const handleInput = () => {
        setInputText(inputRef.current.value)
      }
      const handleAutocomplete =  () =>{
        if(mapApiLoaded){
          const service = new mapApi.places.AutocompleteService()
          const request = {
            input:inputText
          }

          service.getPlacePredictions(request,(results,status) =>{
            if(status===mapApi.places.PlacesServiceStatus.OK){
              console.log(results);
              setAutocompleteResults(results);
            }
          }
            )
        }
      }
      useEffect(()=>{
        handleAutocomplete()
      },[inputText])

      const handleCenterChange = () => {
        console.log("moving center point")
        if(mapApiLoaded) {
          setMyPosition({
            lat: mapInstance.center.lat(),
            lng: mapInstance.center.lng()
          })
        }
      }
      
      const handleClickToChangeMyPosition  = (e) =>{
        const placeId = e.target.getAttribute('dataid')
        const service = new mapApi.places.PlacesService(mapInstance)
        const request = {
          placeId,
          fields: [
            'geometry'
          ]
        }
        
        service.getDetails(request, (results, status)=>{
          if( status === mapApi.places.PlacesServiceStatus.OK) {
            const newPosition = {
              lat: results.geometry.location.lat(),
              lng: results.geometry.location.lng()
            }
            setCurrentCenter(newPosition) // 改變地圖視角位置
            setMyPosition(newPosition) // 改變 MyPosition
            setAutocompleteResults([]) // 清空自動搜尋地址清單
            inputRef.current.value = '' // 清空 <input>
          }
        })
      }
      const AlertFx = () =>(alert("Button Click"))
      const Sidebar = () => ( //這裡創建右側小卡
 
        places.slice(0,6).map((result,index) => (
            <Card
            key={index}
            storename={result.name}
            storedis={'DEFAULT miles'}
            address={result.vicinity}
            onClick={AlertFx}
          ></Card>
        )
        ) 
      )
    findLocation()
    return (
      <>
      <Header />
      <Alerts />
      {/* // Important! Always set the container height explicitly */}
      <div style={{ height: '100vh', width: '100%' }}>
        <div className='sideBar'>
          Address:<input ref={inputRef} type="text" onChange={debounce(handleInput,1000) } /> 
            <div onClick={handleClickToChangeMyPosition} >
              {(autocompleteResults&&inputText)?
              autocompleteResults.map(item=>(
                <div key={item.place_id} dataid={item.place_id}>　
                {item.description}
              </div>
              ))
              :null}
            </div>
            <Sidebar/>
        </div>
        <div className='googleMap'>
        <GoogleMapReact
          bootstrapURLKeys={{ 
              key: API_KEY,
              libraries:['places']
            }}
          center = {currentCenter}
          onBoundsChange={handleCenterChange} // 移動地圖邊界時觸發 handleCenterChange  
          //defaultCenter={props.center}
          defaultZoom={props.zoom}
          yesIWantToUseGoogleMapApiInternals // 設定為 true
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)} // 載入完成後執行
        
        >
          <AnyReactComponent
            lat={myPosition.lat}
            lng={myPosition.lng}
            text="Now Position"
          />
        {
            places.map(item=>(
                <Marker
                className = 'marker'
                icon = {item.icon}
                key = {item.id}
                lat={item.geometry.location.lat()}
                lng={item.geometry.location.lng()}
                text = {item.name}
                />
            ))
        }

        </GoogleMapReact>
        </div>
      </div>
      </>
    );
  }
  
  SimpleMap.defaultProps = {
    center: {
        lat: 40.4517272,
        lng: -79.933525
    },
    zoom: 17
  };


export default SimpleMap