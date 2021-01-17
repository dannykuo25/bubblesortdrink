import React, { useState, useEffect } from 'react';
import host from '../common/Host'


import axios from 'axios';
import ReactStars from "react-rating-stars-component";

import { Modal } from 'react-bootstrap';

const RateCardTmp = (props) => (
    <div className="order_details">
      <div id='drinkname'>{props.drinkname}</div>
    </div>
  
  )

const RateModal = (props) => {

    const [comments, setComments] = useState("");
    const [ratings, setRatings] = useState([]);
    const [ref_code, setRefCode] = useState("");
    const [customerID,setCustomerID] = useState("");
    const handleChange = (e) => {
      setComments(e.target.value);
    }
    useEffect(() => {
      setRefCode(props.ref_code);
      setCustomerID(props.customerid);
    });
    const ratingChanged = (productname, rating) => {
      let newArr = [...ratings];
      let tmp = { name: productname, rating: rating };
      for (let x = 0; x < newArr.length; x++) {
        if (newArr[x].name == tmp.name) {
          newArr.splice(x, 1);
          newArr.push(tmp);
          setRatings(newArr);
          console.log("new array with duplicate", newArr);
          return;
        }
      }
      newArr.push(tmp);
      setRatings(newArr);
      console.log("new array", newArr);
    };
  
    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const SendCommentAndRating = () => {
      let data = JSON.stringify({
        comment:comments,
        ref_code:ref_code,
        customer:customerID
        })
      console.log("comment sent")
      axios.put(host + 'api/order-comment/' + ref_code + "/", data, config).then(function (response) {
        console.log("success post");
      }).catch(function (error) {
        if (error.response.status == 400) {
          alert("Your order has been sent!")
        }
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      })
  
      axios.all(ratings.map( (res) => {
        let data = JSON.stringify({
          name:res.name,
          ratings:res.rating,
          rating_count:0
          })
        return axios.put(host + 'api/product-rating/' + res.name + "/", data, config).then(function (response) {
          console.log("success post new rating");
        })
      }))
  
    }
    return (
      <Modal
        {...props}
        show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Ratings
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Tell us how do you like your tea!</h6>
          <div>
            {props.menu.map((result, index) => {
              let product = props.products.find(obj => obj.id == result.product)
              return(
                <div key={index} >
                <RateCardTmp
                  drinkname={product.name}
                ></RateCardTmp>
                <ReactStars
                  count={5}
                  size={30}
                  activeColor="#ffd700"
                  onChange={(e) => ratingChanged(result.product, e)}
                />
              </div>
              )
              
  
  
            })
            }
          </div>
          <textarea id="customercomment" rows="4" value={comments} onChange={handleChange}></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button className="main-btn" onClick={()=>{
            SendCommentAndRating();
            props.onHide();
            props.onSubmit();
            console.log("props.onHide !");
            }}>Submit</button>
        </Modal.Footer>
      </Modal>
    )
  
  }


  export default RateModal;