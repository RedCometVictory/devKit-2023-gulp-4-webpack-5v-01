// root reducer
import { combineReducers } from 'redux'; // allows all reducers to be collected into one
import alertReducer from './alertReducer';
// import auth from './authReducer';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';

// think of thess rootReducer as state
// thus ex) state.alert, state.auth
export default combineReducers({ // contains any reducers created
  alert: alertReducer,
  auth: authReducer,
  profile: profileReducer,
  post: postReducer
});