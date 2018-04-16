import React from 'react'
import LoginService from './LoginServices'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  /* Component Initialisation */
  componentDidMount() {
    let lgSerUserRes = null;
    var token = this.props.location.query.token ? this.props.location.query.token : null;
    if(!token) {
      showAlert(this, "Invalid Login Credentials");
      browserHistory.push('/login');
    } else {
      sessionStorage.setItem('token',token);
    }
    LoginService.getUserDetails(token)
    .then((response) => {
      lgSerUserRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(lgSerUserRes.ok) {
        sessionStorage.setItem('user',JSON.stringify(responseData));
        browserHistory.push('/sketches');
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(lgSerUserRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  /* Render Method */
  render() {
    return(
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>

    )
  }
}
