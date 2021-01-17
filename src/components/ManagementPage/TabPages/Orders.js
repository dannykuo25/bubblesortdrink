import React, {useState} from 'react';
import axios from 'axios';
import host from '../../common/Host'


import OrderCard from './OrderCard';


import './Orders.styles.css';



class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            orders : [],
            active: 0,
        }
    }

    CheckingStatus = () => {
        axios.get(host + 'api/order/')
          .then((response) => {
            // Success
            this.setState({
              orders: response.data.reverse()
            }
            );
          })
      }

    componentDidMount() {
        axios.get(host+'api/order/')
            .then((response) => {
                this.setState({orders: response.data.reverse()});
            });
        axios.get(host+'api/product/')
        .then((response) => {
            this.setState({products: response.data});
        });

        setInterval(this.CheckingStatus, 10000);
    }

    handleStatusChange = (ref_code, status) => {
        
        let newOrders = this.state.orders;
        let changingOrder = this.state.orders.find(obj => obj.ref_code == ref_code);
        let index = this.state.orders.indexOf(changingOrder)
        changingOrder.status = status;
        newOrders[index] = changingOrder;
        this.setState({orders: newOrders});
    }

    handleOrderDelete = (ref_code) => {
        this.setState({orders: this.state.orders.filter(obj => obj.ref_code != ref_code)})
    }

    renderOrders = (OrderMenuData) => {
    let type = null;
    if(this.state.active == 0){
        return(
            <>
            {OrderMenuData.map(type => (
                <>
                <h1 className="page-name"> {type.name} ({type.data.length})</h1>
                <ul className="order-section">
                    {type.data.map(order => {
                        let orderProducts = [];
                        order.products.map(product => {
                            orderProducts.push(this.state.products.find(obj => obj.id == product.product))
                        })
                        return(
                            <OrderCard onOrderDelete={this.handleOrderDelete} onStatusChange={this.handleStatusChange} order={order} products={orderProducts} />
                        )
                        
    })}
                </ul>
                </>
            ))}
            </>
        )
    } else if(this.state.active == 1) {
        type = OrderMenuData[0];
    } else if (this.state.active == 2){
        type = OrderMenuData[1];
    } else if (this.state.active == 3){
        type = OrderMenuData[2]
    }
    return (
        <>
            <h1 className="page-name"> {type.name} ({type.data.length})</h1>
            <ul className="order-section">
                {type.data.map(order => {
                    let orderProducts = [];
                    order.products.map(product => {
                        orderProducts.push(this.state.products.find(obj => obj.id == product.product))
                    })
                    // console.log('this.state.products', this.state.products)
                    return(
                        <OrderCard isCustomer={false} onOrderDelete={this.handleOrderDelete} onStatusChange={this.handleStatusChange} order={order} products={orderProducts} />
                    )
                    
})}
            </ul>
            </>
    )
        
            
        
    }


    render() {
        const newOrders = this.state.orders.filter(obj => obj.status == 0);
        const AcceptedOrders = this.state.orders.filter(obj => obj.status != 0 && obj.status != 4);
        const PastOrders = this.state.orders.filter(obj => obj.status == 4);
        // console.log("newOrders:", newOrders)
        // console.log("AcceptedOrders:", AcceptedOrders)
        // console.log("PastOrders", PastOrders)

        let OrderMenuData = [
            {
                name: 'New Orders',
                data: newOrders
            },
            {
                name: 'Accepted Orders',
                data: AcceptedOrders
            },
            {
                name: 'Past Orders',
                data: PastOrders
            },

        ];
        
        return(
            <>
            <div className="owner-nav">
                    <nav className="navbar navbar-expand-lg">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="owner-nav-item"><a onClick={() => this.setState({active: 0})} className={this.state.active == 0 ? 'owner-nav-link active' : 'owner-nav-link'}>All ({this.state.orders.length})</a></li>
                            <li className="owner-nav-item"><a onClick={() => this.setState({active: 1})} className={this.state.active == 1 ? 'owner-nav-link active' : 'owner-nav-link'}>New ({newOrders.length})</a></li>
                            <li className="owner-nav-item"><a onClick={() => this.setState({active: 2})} className={this.state.active == 2 ? 'owner-nav-link active' : 'owner-nav-link'}>Accepted ({AcceptedOrders.length})</a></li>
                            <li className="owner-nav-item"><a onClick={() => this.setState({active: 3})} className={this.state.active == 3 ? 'owner-nav-link active' : 'owner-nav-link'}>Past ({PastOrders.length})</a></li>


                            {/* {navlinks.map((navlink, index) => (
                                <li className="owner-nav-item">
                                    <a onClick={() => SwtichPage(navlink,index)} className={activePageIndex==index ? 'owner-nav-link active' : 'owner-nav-link'}>{navlink}</a>
                                </li>
                            ))} */}
                        </ul>
                    </div>
                    </nav>
                </div>
            <div className="item-page">
                {this.renderOrders(OrderMenuData)}
            </div>
            </>
        )
    }
}

export default Orders;