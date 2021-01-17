// import React,{ Component, useRef, useState } from 'react';
// import { BrowserRouter, Route, Link } from "react-router-dom"

// function initMap(){
//     var service = new google.maps.DistanceMatrixService();
//     var origin1 = new google.maps.LatLng(40.4499676, -79.9246);
//     var destinationA = new google.maps.LatLng(40.4414887, -79.958936);

//     service.getDistanceMatrix(
//         {
//           origins: [origin1],
//           destinations: [destinationA],
//           travelMode: 'DRIVING',
//           avoidHighways: true,
//           avoidTolls: true,
//         }, callback);

//         function callback(response, status) {
//             if (status == 'OK') {
//                 console.log(response);
//             }

//           }
// }
// initMap();
// const DistancePage = () => {
//     console.log('in distance page');
//     return(
//         <div>
//             testing;
//         </div>
//       )

// }
// export default DistancePage