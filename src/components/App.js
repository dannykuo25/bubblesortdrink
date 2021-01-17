import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Login from './accounts/Login';
import Register from './accounts/Register';
import PrivateRoute from './common/PrivateRoute';
import Dashboard from './ManagementPage/Dashboard';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '../actions/auth';

import AddressPage from './AddressPage/AddressPage'
import MapPage from './MapPage/MapPage'
import DistancePage from './DistancePage/DistancePage'
import MyOrders from './OrderPage/MyOrders';
import OrderPage from './OrderPage/OrderPage'
import OrderStatusPage from './OrderStatusPage/OrderStatusPage'
import './App.css';

import Payment from './Payment/Payment';
import PaymentPrebuilt from './Payment/PaymentPrebuilt';
import Success from './Payment/Success';

// Alert Options
const alertOptions = {
  timeout: 3000,
  position: 'top center',
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

   componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Fragment>

                <Switch>
                  <PrivateRoute exact path="/" component={AddressPage} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute exact path="/AddressPage" component={AddressPage} />
                  <Route exact path="/MyOrders" component={MyOrders} />
                  <PrivateRoute exact path="/MapPage/:address" component={MapPage} />
                  <PrivateRoute 
                    exact 
                    path="/dashboard" 
                    component={Dashboard}/>
                  <PrivateRoute exact path="/Orderpage/:address" component={OrderPage} /> 
                  <Route exact path="/OrderStatuspage/:uuid" component={OrderStatusPage} /> 
                  <PrivateRoute exact path='/Payment' component={Payment} />
                  <PrivateRoute exact path='/PaymentPrebuilt' component={PaymentPrebuilt} />
                  <PrivateRoute exact path='/success' component={Success} />
                  
                </Switch>
            </Fragment>
            
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

export default App;

const container = document.getElementById("app");
ReactDOM.render(<App />, container);