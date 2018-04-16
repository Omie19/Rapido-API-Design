import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Link } from 'react-router'
import RegistrationService from '../register/RegistrationServices'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      verification: true
    };
    this.alertOptions = AlertOptions;
  }

  /* Component Initialisation */
  componentDidMount() {
    this.handleVerification()
  }

  /* Method to handle verification */
  handleVerification(code) {
    let regSrvVerifyUsrRes = null;
    RegistrationService.verifyUser(this.props.params.pathParam1)
      .then((response) => {
        regSrvVerifyUsrRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(regSrvVerifyUsrRes.ok) {
          browserHistory.push('/login');
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          this.setState({
            verification: false
          })
          if(regSrvVerifyUsrRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Render Method */
  render() {
    let verificationCmp; 
    if(!this.state.verification) {
      verificationCmp = <div className="verification-section">Verification Failed. Please re-try or navigate back to <Link to="/home">Home</Link></div>
    } else {
      verificationCmp = <div className="verification-section">Verifying...</div>
    }
    return(
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {verificationCmp}
      </div>
      
    )
  }
}
