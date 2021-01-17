import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_LEADS, DELETE_LEAD, ADD_LEAD } from './types';
import { GET_PRODUCTS, DELETE_PRODUCT, ADD_PRODUCT } from './types';

// GET LEADS
export const getProducts = () => (dispatch, getState) => {
  axios
    .get('/api/leads/', tokenConfig(getState))
    .get('/api/product/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_LEADS,
        type: GET_PRODUCTS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE LEAD
export const deleteProduct = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/leads/${id}/`, tokenConfig(getState))
    .delete(`/api/product/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ deleteLead: 'Lead Deleted' }));
      dispatch(createMessage({ deleteProduct: 'Product Deleted' }));
      dispatch({
        type: DELETE_LEAD,
        type: DELETE_PRODUCT,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD LEAD
export const addProduct = (product) => (dispatch, getState) => {
  axios
    .post('/api/leads/', lead, tokenConfig(getState))
    .post('/api/product/', product, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ addLead: 'Lead Added' }));
      dispatch(createMessage({ addProduct: 'Product Added' }));
      dispatch({
        type: ADD_LEAD,
        type: ADD_PRODUCT,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};