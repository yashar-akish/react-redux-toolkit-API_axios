import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import { openModal } from '../modal/modalSlice';
// import cartItems from '../../cartItems';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
  // cartItems: cartItems,
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

/*
export const getCartItems = createAsyncThunk('cart/getCartItems', () => {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.log(error));
});
*/

export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkAPI) => {
  try {
    // console.log(name);
    // console.log(thunkAPI);
    // console.log(thunkAPI.getState());
    // thunkAPI.dispatch(openModal());
    const response = await axios(url);
    // console.log(response);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response)
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount += 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount -= 1;
    },
    calculateTotals: (state) => {
      let _amount = 0;
      let _total = 0;

      state.cartItems.forEach((item) => {
        _amount += item.amount;
        _total += item.amount * item.price;
      });

      state.amount = _amount;
      state.total = _total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      // console.log(action);
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      // console.log(action);
      state.isLoading = false;
    },
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
