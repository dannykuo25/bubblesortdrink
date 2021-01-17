import React, { useState } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import host from '../../common/Host'


import RateModal from '../../OrderStatusPage/RateModal';


const OrderCard = (props) => {

    const {order, products, onStatusChange, onOrderDelete, isCustomer} = props;

    const [detailModalShow, setDetailModalShow] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order.status)
    const [orderDeleteShow, setOrderDeleteShow] = useState(false);
    const [reviewShow, setReviewShow] = useState(false);
    const [rateModalShow, setRateModalShow] = useState(false);
    const [hasReview, setHasReview] = useState(!(order.comment == ''));

    const handleStatusChange = (status) => {
        let json = JSON.stringify({
            status: status,
            address: order.address,
            products: order.products,
            totalPrice: order.totalPrice
        });
        axios.put(host + `api/order/${order.ref_code}/`, json, {
            headers: {
                'Content-Type': 'application/json'
            }})
            .then(() => {
                setOrderStatus(status);
                onStatusChange(order.ref_code, status)
            })
    }

    const handleDeclineOrder = () => {
        axios.delete(host + `api/order/${order.ref_code}`)
        .then(() => {
            onOrderDelete(order.ref_code);
        })
        setOrderDeleteShow(false);
    }

    const renderButtons = () => {
        if (!isCustomer){
            if (order.status == 0) {
                return (
                    <>
                    <button className="decline-button" onClick={() => setOrderDeleteShow(true)}>Decline</button>
                    <button className="main-btn" onClick={() => handleStatusChange(1)}>Accpet</button>
                    </>
                )
            } else if (order.status == 4){
                return (
                    <>
                    <button className="main-btn" onClick={() => setOrderDeleteShow(true)}>Delete Order</button>
                    <button className={order.comment == '' ? 'main-btn-disabled' : 'main-btn'} onClick={() => setReviewShow(true)}>See Review</button>
                    </>
                )
            } else {
                return (
                    <>
                    {/* <button className="decline-button" onClick={() => setOrderDeleteShow(true)}>Decline</button> */}
                    <button onClick={() => handleStatusChange(1)} className={order.status >= 1 ? "order-status-active" : "order-status-inactive"}>Preparing</button>
                    <button onClick={() => handleStatusChange(2)} className={order.status >= 2 ? "order-status-active" : "order-status-inactive"}>Delivering</button>
                    <button onClick={() => handleStatusChange(3)} className={order.status >= 3 ? "order-status-active" : "order-status-inactive"}>Arriving</button>
                    <button onClick={() => handleStatusChange(4)} className={order.status == 4 ? "order-status-active" : "order-status-inactive"}>Arrived</button>
                    </>
                )
            }
        } else {
            if (order.status == 4) {
                return(
                    <>
                    <button style={{display: hasReview ? 'none' : 'inline'}} className='decline-button' onClick={() => setRateModalShow(true)}>Write Review</button>
                    <button className='main-btn' style={{backgroundColor: '#c7c7c7', cursor: 'default'}} onClick={() => props.history.push(`/OrderStatusPage/${order.ref_code}`)}>Order Completed</button>

                    <RateModal onSubmit={() => setHasReview(true)} onHide={() => setRateModalShow(false)} show={rateModalShow} products={products} menu={order.products} ref_code={order.ref_code} customerid={order.customer}/>

                    </>
                )
            } else {
                return(
                    <>
                    <button style={{display: hasReview ? 'none' : 'inline'}} className='decline-button' onClick={() => setRateModalShow(true)}>Write Review</button>
                    <button className='main-btn' onClick={() => props.history.push(`/OrderStatusPage/${order.ref_code}`)}>View Order Status</button>
                    <RateModal onSubmit={() => setHasReview(true)} onHide={() => setRateModalShow(false)} show={rateModalShow} products={products} menu={order.products} ref_code={order.ref_code} customerid={order.customer}/>
                    </>
                )
            }
            
        }
        
    }

    let itemTotalQuantity = 0;
    order.products.map(product => {
        itemTotalQuantity += product.quantity
    })

    return(
        <>
            <div className="single-order">
                <div className="order-info-container">
                    <div className="order-image"><img src={products[0] !== undefined ? products[0].image : ""} style={{'width': '5rem', 'height':'5rem'}}/></div>
                    <div className="order-info">
                        <div className="order-main-info"><span>{order.created_at.substring(11,16)} </span> BY <span className="customer-name">{order.customer_name}</span></div> 
                        <div className="order-detail-info">
                            <div><span className="order-address">{order.address} · {order.created_at.substring(5,7)}/{order.created_at.substring(8,10)}/{order.created_at.substring(0,4)}</span></div>
                            <span>{itemTotalQuantity} {itemTotalQuantity == 1 ? "item" : "items"} for ${order.totalPrice}</span>
                            <span><button onClick={() => setDetailModalShow(true)} id="view-details">View details</button></span>    
                        </div>
                    </div>
                </div>
                <div className="dashboard-order-buttons">
                    {renderButtons()}
                </div>
            </div>

            {/* order details modal */}
            <Modal
            show={detailModalShow}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                Order Details
                <span style={{marginLeft: '1rem'}} className="order-id">ID: {order.ref_code}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <div className="modal-order-detail">
                {order.products.map(result => {
                    if (products[0] !== undefined){
                        let productData = products.find(obj => obj.id == result.product)
                        return(
                            <div className="modal-single-product-detail">
                                <img src={productData.image} style={{'width': '4rem', 'height':'4rem'}} />
                                <span className="modal-product-name">{productData.name}</span><span className="modal-product-quantity"> x {result.quantity}</span>
                            </div>
                            )
                    
                    }
                    
                })}
            </div>
            <div className="modal-deliver-to">Deliver to: <span className="modal-order-address">{order.address}</span> </div>
            

            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => setDetailModalShow(false)}>Close</button>
            </Modal.Footer>
            </Modal>

            {/* delete modal */}
            <Modal
                show={orderDeleteShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                Do you want to decline this order? The order will be deleted. 
                
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleDeclineOrder}>Yes,Delete</button>
                    <button onClick={() => setOrderDeleteShow(false)}>No, Cancel</button>
                </Modal.Footer>
            </Modal>
        
        {/* order review modal */}
            <Modal
            show={reviewShow}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                Review
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <div className="modal-review">
                    {order.comment}
            </div>

            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => setReviewShow(false)}>Close</button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default withRouter(OrderCard);