import { GET_PRODUCTS, DELETE_PRODUCT, ADD_PRODUCT, CLEAR_PRODUCTS } from '../actions/types.js';

const initialState = {
  leads: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        leads: action.payload,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        leads: state.leads.filter((lead) => lead.id !== action.payload),
      };
    case ADD_PRODUCT:
      return {
        ...state,
        leads: [...state.leads, action.payload],
      };
    case CLEAR_PRODUCTS:
      return {
        ...state,
        leads: [],
      };
    default:
      return state;
  }
}