import apiObj from '../utils/ApiServices'

const LoginApiCall = {
  login(userObject) {
    // AWS Endpoint
    return fetch(apiObj.endPoint + 'login', { 
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "password": userObject.password,
        "email": userObject.userId
      })
    });
  },
  getUserDetails(token) {
    return fetch(apiObj.endPoint + 'me', { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }
  
}

export default LoginApiCall;