// src/store.js
import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import adminLoginReducer from './reducers/adminLoginReducer';
import userReducer from './reducers/userReducer';
import taskReducer from './reducers/taskReducer';
import { chatReducer } from './reducers/chatReducers';
import { categoryReducer } from './reducers/categoryReducer';
import { notesReducer } from './reducers/notesReducer';
import templateReducer from './reducers/templateReducer';

// ✅ Combine reducers
const rootReducer = combineReducers({
  adminLogin: adminLoginReducer,
  user: userReducer,
  task: taskReducer,
  chat: chatReducer,
  category: categoryReducer,
  notes: notesReducer,
  template: templateReducer
});

// ✅ Use native Redux compose + window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
