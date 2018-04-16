import apiObj from '../utils/ApiServices'

const RegistrationApiCall = {
  register(userObject) {
    // AWS Endpoint
    return fetch(apiObj.endPoint + 'user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "password": userObject.password,
        "email": userObject.email,
        "firstname": userObject.firstName,
        "lastname": userObject.lastName,
        "link": window.location.origin + "/verify/"
      })
    });
  },

  updateUserDetails(userObject) {

    var token  = sessionStorage.getItem("token");

    return fetch(apiObj.endPoint + 'user/' + userObject.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        "oldPassword": userObject.oldPassword,
        "password": userObject.password,
        "email": userObject.email,
        "firstname": userObject.firstname,
        "lastname": userObject.lastname
      })
    });
  },

  resetUserDetails(userId) {
    // AWS Endpoint
    return fetch(apiObj.endPoint + 'user/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": userId,
        "link": window.location.origin + "/resetPassword/"
      })
    });
  },

  updateUserPassword(obj) {
    // AWS Endpoint
    return fetch(apiObj.endPoint + 'user/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "token": obj.token,
        "password": obj.password
      })
    });
  },

  verifyUser(code) {
    // AWS Endpoint
    return fetch(apiObj.endPoint + 'user/verify/'+code, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}

export default RegistrationApiCall;
