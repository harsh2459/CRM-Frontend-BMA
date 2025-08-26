import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAIL,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
} from "../actionTypes/categoryActionTypes.jsx";

// Fetch categories from the backend
export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const response = await axiosInstance.get("/category/get"); // Fetch categories from backend
    dispatch({
      type: FETCH_CATEGORIES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    dispatch({
      type: FETCH_CATEGORIES_FAIL,
      payload: errorMsg,
    });
    toast.error(errorMsg);
  }
};

// Add a new category
export const addCategory = (name, dueTime) => async (dispatch) => {
  dispatch({ type: ADD_CATEGORY_REQUEST });
  try {
    const response = await axiosInstance.post("/category/add", {
      name,
      dueTime,
    });

    dispatch({
      type: ADD_CATEGORY_SUCCESS,
      payload: response.data,
    });
    toast.success("Category added successfully!");
     return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    dispatch({
      type: ADD_CATEGORY_FAIL,
      payload: errorMsg,
    });
    toast.error(errorMsg);
      throw error;
  }
};
