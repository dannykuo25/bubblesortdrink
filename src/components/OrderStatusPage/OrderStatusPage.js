import React, { Component, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from 'axios';
import './OrderStatusPage.css'
const host = 'https://bubble-sort-drink.herokuapp.com/'
import Header from '../layout/Header';
import Alerts from '../layout/Alerts';

import Geocode from "react-geocode"
import GoogleMapReact from 'google-map-react';
import RateModal from './RateModal';

import icon from '../Assets/bubble-tea-icon.png';
import home from '../Assets/home.png';

import { ProgressBar, Modal, Button } from 'react-bootstrap';
import googleMapReact from 'google-map-react';

import {withRouter} from 'react-router'





const AnyReactComponent = ({ text }) => <div>{text}</div>;

const MyPositionMarker = () =>
  <div>
    <img id="icon_img" src={home}></img>
  </div>
const BubbleMarker = () =>
  <div>
    <img id="icon_img" src={icon}></img>
  </div>

const orderFakeData = [
  { name: "Kung fu milk tea1", price: "10", quantity: "1" },
  { name: "Kung fu milk tea2", price: "12", quantity: "1" },
  { name: "Honeymilk tea1", price: "12", quantity: "1" },
  { name: "Honeymilk tea2", price: "12", quantity: "1" }
]
const defaultText = ["Processing your order...", "Order accpeted. Preparing your order...", "Your order is ready! Delivering your tea...", "Your tea is arrving...", "Your tea has arrived! Enjoy :)"]


const SimpleMap = (props) => {

  
  const [myPosition, setMyPosition] = useState({
    lat: 0,
    lng: 0
  })

  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [mapApi, setMapApi] = useState(null)

  
  const apiHasLoaded = (map, maps) => {
    setMapInstance(map)
    setMapApi(maps)
    setMapApiLoaded(true)
    console.log("map:", map);
  };

  var markerTimer;
  const markerLoader = () => { // need to fix later, this will trigger too many times
    markerTimer = setTimeout(handleCenterChange, 2000);
    
  }

  const handleCenterChange = () => {
    if (mapApiLoaded) {

      clearTimeout(markerTimer);
      setMyPosition({
        lat: props.lat,
        lng: props.lng
      })
    }
  }

  useEffect(markerLoader);


  return (
    <div style={{ height: '95vh', width: '100%', position: 'absolute' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "DummyKey" }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        yesIWantToUseGoogleMapApiInternals
        onBoundsChange={handleCenterChange}
        onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
      >
        <MyPositionMarker
          lat={myPosition.lat}
          lng={myPosition.lng}
          text="11"
        />
        <BubbleMarker
          lat={40.4334885}
          lng={-79.9250417}
        />
      </GoogleMapReact>
    </div>
  );
}

SimpleMap.defaultProps = { //default center of google map
  center: {
    lat: 40.4334089,
    lng: -79.9225901
  },
  zoom: 12
};
const inlinestyle = {
  position: 'absolute',
  right: '0',
  paddingRight: '10px'
};


const OrderCardTmp = (props) => (
  <div className="order_details">
    <div id='drinkname'>{props.drinkname}</div>
    {/* <div id='price'>${props.price}</div> */}
    <div id='quantity'>x {props.quantity}</div>
  </div>

)


const CheckOutCard = (props) => (
  <div>
    <div className="est_card">
      <h2>{props.estTime}</h2>
      <span id="est_time" >Estimated arrival</span>
      <ProgressBar id="progress_bar" variant="danger" now={props.currentStatus} />
      <p id='status_text'>{props.status_text}</p>
    </div>
    <div className="sub_card2">
      <h4>Order Details</h4>
      <div>
        {props.menu.map((result, index) => {
          // console.log('obj', obj);
          // console.log('product = ', product);
          // console.log('result = ', result);
          return(
            <OrderCardTmp
            key={index}
            drinkname={result.productName}
            quantity={result.quantity}
            price={result.price}
          ></OrderCardTmp>
          )
        })
        }
      </div>
      <div className="subtotal_card">
        <div id='subtotal'>Subtotal:<span style={inlinestyle} >{props.subtotal}</span></div>
        <div id='tax'>Tax:<span style={inlinestyle} >{props.tax}</span></div>
        <div id='Total'>Total:<span style={inlinestyle} >{props.total}</span></div>
      </div>
    </div>
  </div>
)

const getAddress = (pos) => {
  Geocode.setApiKey("DummyKey");
  Geocode.setLanguage("en");
  return Promise.resolve(Geocode.fromAddress(pos).then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;


      return [lat, lng]
    },
    error => {
      console.error(error);
    }
  ))

}



function GetEstTime(_lat, _lng, cb) {
  let service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [{ lat: _lat, lng: _lng }],
      destinations: [{ lat: 40.4334885, lng: -79.9250417 }],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    }, cb);

}


class OrderStatusPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      subtotal: 0,
      lat: 0,
      lng: 0,
      uuid: "",
      status_text: defaultText[0],
      currentStatus: 0,
      estTime: "Estimating..",
      rateModalShow: false,
      isSent: false,
      items: [],
      customerID:"",
      menu:[]
    }
    this.CheckingStatus = this.CheckingStatus.bind(this);
    this.SetNewTime = this.SetNewTime.bind(this);

  }


  SetNewTime(response, status) {
    // console.log(this.state.subtotal)
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      window.alert('Error was' + status);
    } else {
      // console.log(response.rows[0].elements[0].duration.value / 60);
      let addTime = response.rows[0].elements[0].duration.value / 60;
      let nowTime = new Date;
      let _estTimeHour = nowTime.getHours();
      let _estTimeMin = Math.round(nowTime.getMinutes() + addTime + this.state.subtotal / 5);
      if (_estTimeMin > 60) {
        _estTimeHour += 1;
        _estTimeMin -= 60;
      }
      if (_estTimeHour >= 24) {
        _estTimeHour -= 24;
      }
      if (_estTimeMin < 10) {
        _estTimeMin = "0" + _estTimeMin.toString();
      }
      if (_estTimeHour < 10) {
        _estTimeHour = "0" + _estTimeHour.toString();
      }
      let timeToText = _estTimeHour.toString() + " : " + _estTimeMin.toString();
      this.setState({
        estTime: timeToText
      })

    }

  }

  componentDidMount() {
    axios.get(host + 'api/order/' + this.props.match.params.uuid + '/')
      .then((response) => {
        // Success
        console.log('this.props.match.params.uuid', this.props.match.params.uuid);
        console.log('response', response);
        console.log("get the new data", response.data)

        this.setState({
          address: response.data.address,
          subtotal: response.data.totalPrice,
          currentStatus: parseInt(response.data.status),
          items: response.data.products,
          uuid: this.props.match.params.uuid,
          customerID:response.data.customer
        })
    
        getAddress(this.state.address).then((x) => {
          GetEstTime(x[0], x[1], this.SetNewTime);
          this.setState(
            {
              lat: x[0],
              lng: x[1],

            }
          );

        })

      })
    
    axios.get(host + 'api/product/').then((response) => {
      this.setState({menu: response.data})
    })
    
    setInterval(this.CheckingStatus, 10000);
  }

  CheckingStatus() {
    axios.get(host + 'api/order/' + this.props.match.params.uuid + '/')
      .then((response) => {
        // Success
        console.log(response.data.status);
        this.setState({
          currentStatus: parseInt(response.data.status),
          status_text: defaultText[parseInt(response.data.status)]
        }
        );
      })


    if (this.state.currentStatus == 4 && !this.state.isSent) {
      this.setState({
        rateModalShow: true,
        isSent: true
      }
      );
    }
  }

  render() {
    console.log(this.state);
    if (this.state.menu.length !== 0 && this.state.items.length !== 0) {
      return (
        <div className="page2">
          <Header />
          <Alerts />
          <div className="info">
            <div className="sidebar">
              <CheckOutCard
                menu={this.state.items}
                subtotal={(this.state.subtotal).toFixed(2)}
                tax={(this.state.subtotal * 0.05).toFixed(2)}
                total={(this.state.subtotal * 1.05).toFixed(2)}
                status_text={defaultText[this.state.currentStatus]}
                currentStatus={this.state.currentStatus * 25}
                estTime={this.state.estTime}
              />
              <RateModal
                products={this.state.menu}
                show={this.state.rateModalShow}
                onHide={() => { this.setState({ rateModalShow: false }) }}
                onSubmit = {() => {this.props.history.push("/MyOrders")}}
                menu={this.state.items}
                ref_code={this.state.uuid}
                customerid = {this.state.customerID}
  
              ></RateModal>
            </div>
            <div className="google_map">
              <SimpleMap
                lat={this.state.lat}
                lng={this.state.lng}
              ></SimpleMap>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }
  }
}

export default withRouter(OrderStatusPage);