import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { connect } from 'react-redux';


import './OrderPage.css'
const host = 'https://bubble-sort-drink.herokuapp.com/'
import PropTypes from 'prop-types';
import Header from '../layout/Header';
import Alerts from '../layout/Alerts';
import Geocode from "react-geocode"

const stripePromise = loadStripe('pk_test_51HtMtlDewreRBzr0BidYM1pv5K6uBwwSm9K0nyOV7Mh4rmAfjLmW7Q9YMBRqIPdkLDEFgiq6AsOtai3pCPxiGDA800VYXNaYgY');
const categoryFakeData = [
        {name:"Milk tea",index:1},
        {name:"Slush",index:0},
        {name:"Tea",index:2},
        {name:"Juice",index:3}
]

const DrinkCard = (props) => ( // how to onclick and how to put everything in div in css
    <div className="drink_card">
       
        <div className="drink-info-container">
            <div id='drinkname'>{props.drinkname}</div>
            <div id='description'>{props.description}</div>
            <div id='tea-price'>${props.price}</div>
            
            <div id='add_btn'>
                <button onClick={props.onClickDel}>-</button>
                <button onClick={props.onClickAdd}>+</button>
            </div>
        </div>
        
        <div style={{display: 'flex'}}>
            <div style={{color: '#EB5757', fontWeight: 'bold'}} id='rate'><i class="fas fa-star"></i> {props.rate.toFixed(1)} / 5.0 </div>
            <div><img src={props.image} style={{'width': '10rem', 'height': '10rem', 'objectFit': 'cover'}} /></div>
           
        </div>
       
    </div>

)
const OrderCardTmp = (props) => (
    <div className="order_card">
        <div id='drinkname'>{props.drinkname}</div>
        <div id="product-price">${props.price}</div>
        <div id='quantity'>{props.quantity}</div>
    </div>

)

const inlinestyle = {
    position: 'absolute',
    right: '0',
    paddingRight: '10px'
};
const SubCard = (props) => (
    <div className="sub_card">
        <div id='subtotal'>Subtotal:<span style={inlinestyle} >{props.subtotal}</span></div>
        <div id='tax'>Tax:<span style={inlinestyle} >{props.tax}</span></div>
        <div id='Total'>Total:<span style={inlinestyle} >{props.total}</span></div>
    </div>
)

const CategoryCard = (props) => (
    <div onClick={props.onClick}>{props.category}</div>

)
const AddressBar = (props) => (
    <div className="address_bar">
        Deliver to: <span className='delivery-address'>{props.address}</span>
    </div>
)

const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  

class OrderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            category: 1,
            categories: [],
            menu: [],
            subtotal: 0,
            address: "",
            latAndlong: [0, 0],
            time: "0 mins",
            uuid:"",
            
        }
        this.CatergoryHandler = this.CatergoryHandler.bind(this);
        this.SubmitOrder = this.SubmitOrder.bind(this);

   
    }

static propTypes = {
    auth:PropTypes.object.isRequired
};
    componentDidMount() { // get address from previous page
        var _uuid = Number(Math.random().toString().substr(3,1) + Date.now()).toString(36);
        this.setState(
            {
                address: this.props.match.params.address,
                uuid:_uuid
            }
        );
        // this.getAddress(this.props.match.params.address);
        axios.get(host + 'api/product/')
            .then((response) => {
                // Success
                // console.log(response.status);
                // console.log(response.data);
                this.setState({
                    menu: response.data
                }
                );
                

            })

        axios.get(host + 'api/category/')
        .then((response) => {
            this.setState({
                categories: response.data,
            }
            );

            this.setState({
                category: response.data[0].order,
            })
        })

    }

    OrderCard() {
        return (
            this.state.items.map((result, index) => {
                let product = this.state.menu.find(obj => obj.id == result.product);
                return(
                    <OrderCardTmp
                        key={index}
                        drinkname={product.name}
                        quantity={result.quantity}
                        price={result.price}
                    ></OrderCardTmp>
                )
                
            })
        )
    }
    AddHandler = (res) => {
        let newObj = {
            product: res.id,
            quantity: 1,
            price: res.list_price,
            productName: res.name
        }
    
        console.log('newObj =', newObj)
        console.log('productName =', newObj.productName)

        for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i].product == newObj.product) {
                this.state.items[i].quantity += 1;
                this.state.items[i].price += res.list_price;
                this.state.subtotal += res.list_price;
                this.setState(
                    {
                       
                    }
                )
               
                return;
            }
        }
        this.state.subtotal += res.list_price;
        this.setState(
            {
                items: this.state.items.concat(newObj),
                
            }
        )
        

    }
    DelHandler = (res) => {
        console.log("testing!")
        var array = [...this.state.items]
        for (let i = 0; i < this.state.items.length; i++) { 
            if (this.state.items[i].product == res.id) {
                if (this.state.items[i].quantity == 1) {
                    this.state.subtotal -= res.list_price;
                    array.splice(i, 1);
                    this.setState(
                        {
                            items: array
                        }
                    )
                    return;
                } else {
                    this.state.items[i].quantity -= 1;
                    this.state.items[i].price -= res.list_price;
                    this.state.subtotal -= res.list_price;
                    this.setState({});
                    return;
                }

            }
        }


        console.log("Not found");
    }
    CardList() {
        if(this.state.menu != []){
            return (
                this.state.menu.map((result, index) => {
                    if (result.category.order == this.state.category) {
                        return (
                            <DrinkCard
                                image={result.image}
                                key={index}
                                drinkname={result.name}
                                description={result.description}
                                price={result.list_price}
                                rate = {result.ratings}
                                onClickAdd={() => this.AddHandler(result)}
                                onClickDel={() => this.DelHandler(result)}
                            ></DrinkCard>
                        )
                    }
    
                })
            )
        }
       
    }
    CatergoryHandler(index) {
        this.setState({
            category: index,
        })
     
    }
    CatergoryList() {
        
        return (
            this.state.categories.map((category,index) => (
                <div onClick={() => this.CatergoryHandler(category.order)} className={category.order == this.state.category ? "catergory_card active" : "catergory_card"}>
                     <CategoryCard
                    key={index}
                    category={category.name}
                ></CategoryCard>
                </div>
               
            ))

        )
    }
    SubmitOrder() {
        console.log("post");
        const user = this.props.auth.user; // get user id
        let data = JSON.stringify({
            customer: user.id,
            products: this.state.items,
            status: 0,
            totalPrice: this.state.subtotal, 
            address: this.state.address,
            ref_code: this.state.uuid,
            customer_name: user.username,
        });
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'token '+this.props.auth.token
            }
          }
        axios.post(host + 'api/order/', data,config
        )
            .then(function (response) {
                console.log("success post");
            }).catch(function (error) {
                if(error.response.status==400){
                    alert("Error!")
                }
                console.log( error.response.data );
                console.log( error.response.status );
                console.log( error.response.headers );
            }).then( ()=> {
                const paymentfunction = async()=>{
                   console.log("testing!",this.state.subtotal * 105); 
                   const stripe = await stripePromise;
                   const response = await fetch('api/checkout/', {
                       method: 'POST',
                       headers: {
                         'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                         unit_amount: this.state.subtotal * 105,
                         ref_code: this.state.uuid
                       }),
                     });
                     console.log(response);
                     const session = await response.json();
                     console.log(session);
                     // When the customer clicks on the button, redirect them to Checkout.
                     const result = await stripe.redirectToCheckout({
                       sessionId: session,

                     });
               };
               paymentfunction();

           });
    }

    render() {
        

        return (
            <div>
                <Header />
                <Alerts />
                <div className='page'>
                    <AddressBar
                        address={this.state.address}
                    />
                    <div className='catergory_slide'>
                        {this.CatergoryList()}
                    </div>
                    <div className='menu_slide'>
                        {this.CardList()}
                    </div>
                    <div className='your_order_slide'>
                        <h4>YOUR ORDER</h4>
                        {this.OrderCard()}
                        <SubCard
                            subtotal={(this.state.subtotal).toFixed(2)}
                            tax={(this.state.subtotal * 0.05).toFixed(2)}
                            total={(this.state.subtotal * 1.05).toFixed(2)}
                        ></SubCard>

                         <button id='checkout_btn' onClick={this.SubmitOrder}>CHECKOUT NOW</button>
                 
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,{})(OrderPage);