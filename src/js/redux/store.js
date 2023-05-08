import { createStore, applyMiddleware } from 'redux';
// display reducers/ middlewares in redux-dev-tools browser extension
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import setAuthToken from '../utils/setAuthToken';
import rootReducer from './reducers/rootReducer';
// check if access token is expired before any async action dispatch
// import jwtRefresh from '../utils/jwtRefreshToken';

const initialState = {}; // included for all reducers
const middleware = [thunk]; // list middlewares here
// const middleware = [jwtRefresh, thunk]; // list middlewares here

const store = createStore(
  rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware))
);

// subscription listener stores user token into LS
// init current state from redux store, used for comparison to prevent undefined values
let currentState = store.getState();

store.subscribe(() => {
  // compare current state with previous state
  let previousState = currentState;
  currentState = store.getState(); // from rootreducer
  // console.log("current state");
  // console.log(currentState);
  // if token changes, set the value in LS and axios headers
  if (previousState !== currentState.auth.token) {
    // central state is the root reducer
    // access authReducer (set as auth in the rootReducer)
    const token = currentState.auth.token;
    setAuthToken(token);
  }
})
export default store;