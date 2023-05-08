// function takes in a token from the auth action, if the token is there, then add it to the global headers, if not - then delete it from the headers
import axios from 'axios';

// Reason behind doing this is that whenever we have a token we are simply going to send it with every request. Instead of being selective about it (which request to send the token with).

// no request made via axios, simply adding a global header pass in token validate if true:
const setAuthToken = token => {
  // token value derived from localstorage
  if (token) {
    // set global header to the value of the token passed in:
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // if no token, delete global header
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

// pass value back into (auth) actions
export default setAuthToken;

/* secondary option
// takes token from auth action, if there, add it to Authorization headers, if not - delete header
import api from './api';

// When we have a token, it's sent with every request.
const setAuthToken = token => {
  // token value derived from localstorage
  if (token) {
    // set global header to value of token passed in:
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // set token to LS
    localStorage.setItem('token', token);
  } else {
    // if token is expired (perhaps do a refresh, then continue with a second url request followed by setting the token into the header)
    // if no token, delete global header
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}
// pass value back into (auth) actions
export default setAuthToken;
*/