import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import OrderCard from '../ManagementPage/TabPages/OrderCard';

import Header from '../layout/Header';
import Alerts from '../layout/Alerts';
import host from '../common/Host'



class MyOrders extends React.Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            products: [],
        }
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
      };

    componentDidMount() {
        let user = this.props.auth.user; 
        while (user == undefined || user == null) {
            console.log('trying to catch user info...');
            user = this.props.auth.user;
        }
        axios.get(host+'api/order/')
        .then((response) => {
            this.setState({orders: response.data.reverse().filter(obj => obj.customer == user.id)});
        });
        axios.get(host+'api/product/')
        .then((response) => {
            this.setState({products: response.data});
        });
    }

    render() {
        if (this.state.orders.length !== 0 && this.state.products.length !== 0) {
            return(
                <div>
                    <Header />
                    <Alerts />
                    <div className="my-orders-page">
                      <h1 className='page-name'>My Orders</h1>
                    {this.state.orders.map(order => (
                         <OrderCard order={order} products={this.state.products} isCustomer={true} />
                    ))}
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

const mapStateToProps = (state) => ({
    auth: state.auth,
  });

export default connect(mapStateToProps, {})(MyOrders);