import React, { Component, Fragment } from "react";

class Success extends Component {
  render() {
    return (
      <div className='container'>
        <h1>Thanks for your order!</h1>
        <p>
          We appreciate your business!
          If you have any questions, please email 
        <a href="mailto:bubblesort17637@andrew.cmu.edu"> bubblesort17637@andrew.cmu.edu</a>.
        </p>
      </div>
    );
  }
}

export default Success;