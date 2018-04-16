import React from 'react';
import AlertContainer from 'react-alert'
import RegistrationService from './register/RegistrationServices'
import ChangeEmailModal from './profile/changeEmailModal';
import ChangePasswordModal from './profile/changePasswordModal';
import {showAlert, AlertOptions} from './utils/AlertActions'
import { Link } from 'react-router'

export default class extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        changeEmailModalIsOpen: false,
        changePasswordModalIsOpen: false
      };
      this.alertOptions = AlertOptions;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.changeEmailSuccess = this.changeEmailSuccess.bind(this);
      this.changePasswordSuccess = this.changePasswordSuccess.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {    
    let userObj = JSON.parse(sessionStorage.getItem('user'));
    if(userObj) {
      this.setState({
        "id": userObj.id,
        "firstName": userObj.firstname,
        "lastName": userObj.lastname,
        "email": userObj.email,
      })
    }
  }

  changeEmailToggleModal() {
    this.setState({
      changeEmailModalIsOpen: !this.state.changeEmailModalIsOpen
    });
  }

  changePasswordToggleModal() {
    this.setState({
      changePasswordModalIsOpen: !this.state.changePasswordModalIsOpen
    });
  }


  /* Method to handle input change */
  handleChange(e) {
    e.target.classList.add('active');

    this.setState({
      [e.target.name]: e.target.value
    });

    this.showInputError(e.target.name);
  }

  /* Method to submit user Details */
  handleSubmit(event) {
    event.preventDefault();
    if (this.showFormErrors()) {
      let regSrvUpdUsrDetails = null;
      let userObj = {
        "id": this.state.id,
        "firstname": this.state.firstName,
        "lastname": this.state.lastName,
      };
      RegistrationService.updateUserDetails(userObj)
      .then((response) => {
        regSrvUpdUsrDetails = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(regSrvUpdUsrDetails.ok) {
          showAlert(this, "Profile updated");
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

  /* Method to show Form Errors */
  showFormErrors() {
    const inputs = document.querySelectorAll('input');
    let isFormValid = true;

    inputs.forEach(input => {
      input.classList.add('active');

      const isInputValid = this.showInputError(input.name);

      if (!isInputValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /* Method to show Input Errors */
  showInputError(refName) {
    const validity = this.refs[refName].validity;

    var label = "";
    if(refName == "firstName") {
      label = "First Name";
    } else if (refName == "lastName") {
      label = "Last Name";
    }

    const error = document.getElementById(`${refName}Error`);

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`;
      }
      return false;
    }

    error.textContent = '';
    return true;
  }

  changeEmailSuccess(userObj) {
    this.setState({
      "id": userObj.id,
      "firstName": userObj.firstname,
      "lastName": userObj.lastname,
      "email": userObj.email,
    });
  }

  changePasswordSuccess() {

  }

  /* Render Method */
  render() {
    let creationLabel;
    if (!this.props.fromDashboard) {
      creationLabel = <h3>Create an account</h3>
    }
    var userDetailsSection = <div className="mainSection">
      <div className="nameSection">{this.state.firstName} {this.state.lastName}</div>
      <div className="emailSection">{this.state.email}</div>
    </div>

    return(
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="userDetailsSection">
        {userDetailsSection}
      </div>
      <div className="tabsContainer profilePageTabsSection">
        <ul className="tabs profilePageTabs">
          <li className={this.props.location.pathname === '/profile' ? 'tab profilePageTab active-tab': 'tab profilePageTab'}><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
      <div className="profilePageHeader">
        Account Basic Details
      </div>
        <div className="col-md-12 profilePageTabMainSection">
          <form className="col-md-4" noValidate onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="firstName"
                ref="firstName"
                placeholder="First Name *"
                value={ this.state.firstName }
                onChange={ this.handleChange }
                maxLength="6"
                required />
              <div className="error" id="firstNameError"></div>
            </div>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="lastName"
                ref="lastName"
                placeholder="Last Name *"
                value={ this.state.lastName }
                onChange={ this.handleChange }
                maxLength="6"
                required />
              <div className="error" id="lastNameError"></div>
            </div>
            <div className="form-group">
              <button className="btn btn-default form-control" onClick={ this.handleSubmit }>Update</button>
            </div>
          </form>
        </div>
        <div className="profilePageSeprator">
          <div className="profileLinks" onClick={this.changeEmailToggleModal.bind(this)}>Change Email Address</div>
          <div className="profileLinks" onClick={this.changePasswordToggleModal.bind(this)}>Change Password</div>
        </div>
        <ChangeEmailModal show={this.state.changeEmailModalIsOpen}
        onClose={this.changeEmailToggleModal.bind(this)}
        onConfirm={this.changeEmailSuccess}>
        </ChangeEmailModal>
        <ChangePasswordModal show={this.state.changePasswordModalIsOpen}
        onClose={this.changePasswordToggleModal.bind(this)}
        onConfirm={this.changePasswordSuccess}>
        </ChangePasswordModal>
      </div>
    )
  }
}