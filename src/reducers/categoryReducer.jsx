import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAIL,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
} from "../actionTypes/categoryActionTypes";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
    case ADD_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };

    case FETCH_CATEGORIES_FAIL:
    case ADD_CATEGORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
