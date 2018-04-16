import React from 'react';
//import teamService from './teamServices'
import AlertContainer from 'react-alert'
import RegistrationService from '../register/RegistrationServices'
import {showAlert, AlertOptions} from '../utils/AlertActions'

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
    this.alertOptions = AlertOptions;
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Method to handle input change */
  handleChangeEmail(e) {
    e.target.classList.add('active');
    
    this.setState({
      [e.target.name]: e.target.value
    });
    
    this.showInputErrorEmail(e.target.name);
  }

  /* Method to show Form Errors */
  showFormErrorsEmail() {
    const inputs = document.querySelector(".changeEmailForm").querySelectorAll("input");
    let isFormValid = true;
    
    inputs.forEach(input => {
      input.classList.add('active');
      
      const isInputValid = this.showInputErrorEmail(input.name);
      
      if (!isInputValid) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }

  /* Method to show Input Errors */
  showInputErrorEmail(refName) {
    const validity = this.refs[refName].validity;

    const error = document.getElementById(`${refName}Error`);

    var label = "";
    if (refName == "email") {
      label = "Email";
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `It's a required field`; 
      } else if (validity.typeMismatch) {
        error.textContent = `${label} should be a valid email address`;
      }
      return false;
    }
    
    error.textContent = '';
    return true;
  }

  /* Method to submit */
  handleSubmit(event) {
    event.preventDefault();
    if (this.showFormErrorsEmail()) {
      let regSrvUpdUsrDetails = null;
      let userObjFromSession = JSON.parse(sessionStorage.getItem('user'));
      let userObj = {
        "id": userObjFromSession.id,
        "email": this.state.email
      };
      RegistrationService.updateUserDetails(userObj)
      .then((response) => {
        regSrvUpdUsrDetails = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(regSrvUpdUsrDetails.ok) {
          userObjFromSession["email"] = this.state.email;
          this.props.onConfirm(userObjFromSession);
          this.props.onClose();
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(regSrvUpdUsrDetails.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  /* Render Method */
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    
    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50,
      height: '100%',
      zIndex: 1000
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 150,
      maxHeight: 200,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    return (
      <div style={backdropStyle}>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Change Email Address
          </h4>
          <form className="col-md-12 changeEmailForm" noValidate>
            <div className="form-group">
              <div className="col-md-9">
                <input className="form-control"
                type="email"
                name="email"
                ref="email"
                placeholder="Email *"
                value={ this.state.email } 
                onChange={ this.handleChangeEmail }
                required />
                <div className="error" id="emailError"></div>
              </div>
              <div className="form-group">
                <button className="btn btn-default" onClick={this.handleSubmit}>
                  Update
                </button>
              </div>
            </div>
          </form>
          <div className="form-group pull-right">
              <button className="btn btn-default cancel-button changeEmailModalCloseBtn" onClick={this.props.onClose}>
                Close
              </button>
            </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default Modal;