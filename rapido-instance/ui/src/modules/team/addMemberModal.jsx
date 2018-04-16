import React from 'react';
import teamService from './teamServices'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      memberQuery: '',
      searchResult: []
    };
    this.alertOptions = AlertOptions;
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  /* Method to handle input change */
  handleChange(e) {
    e.target.classList.add('active');
    
    this.setState({
      [e.target.name]: e.target.value
    });
    
    this.showInputError(e.target.name);
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

    const error = document.getElementById(`${refName}Error`);

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `It's a required field`; 
      } else if (validity.tooShort) {
        error.textContent = `More than three characters`; 
      }
      return false;
    }
    
    error.textContent = '';
    return true;
  }

  handleSearch(event) {
    event.preventDefault();
    if (this.showFormErrors()) {
      let teamServSrchMemRes = null;      
      teamService.searchMember(this.state.memberQuery)
        .then((response) => {
          teamServSrchMemRes = response.clone();
          return response.json();
        })
        .then((responseData) => {
          if(teamServSrchMemRes.ok ) {
            this.setState({
              searchResult: responseData
            });
          } else {
            showAlert(this, (responseData.message) ? responseData.message : "Error occured");
            if(teamServSrchMemRes.status == 401) {
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

  /* Method to submit */
  handleSubmit(event, memberObj) {
      let member = {
        "id" : memberObj.member.id,
        "access" : event.target.parentElement.children[2].value
      }
      let teamServAddTeamMemRes = null;
      let teamId = sessionStorage.getItem('teamId');
      teamService.addTeamMember(teamId, member)
        .then((response) => {
          teamServAddTeamMemRes = response.clone();
          return response.json();
        })
        .then((responseData) => {
          if(teamServAddTeamMemRes.ok ) {
            member["email"] = memberObj.member.email;
            this.props.onConfirm(member);
            this.props.onClose();
          } else {
            showAlert(this, (responseData.message) ? responseData.message : "Error occured");
            if(teamServAddTeamMemRes.status == 401) {
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
      minHeight: 250,
      maxHeight: 400,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    const members = this.state.searchResult.map(function (member) {
      return (
        <div className="memberRow" key={member.id}>
          <span>{member.email}</span>
          <button onClick={(e) => this.handleSubmit(e, {member})}>Add</button>
          <select value={member.access}>
            <option value="MEMBER">MEMBER</option>
            <option value="OWNER">OWNER</option>
          </select>
        </div>
      );
    }, this);

    return (
      <div style={backdropStyle}>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Add Member
          </h4>
          <form className="col-md-12" noValidate>
            <div className="form-group">
              <div className="col-md-9">
                <input className="form-control"
                type="text"
                name="memberQuery"
                ref="memberQuery"
                placeholder="Search Member *"
                minLength="4"
                value={ this.state.memberQuery } 
                onChange={ this.handleChange }
                required />
                <div className="error" id="memberQueryError"></div>
              </div>
              <div className="col-md-3">
                <button className="btn btn-default" onClick={this.handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </form>
          <div className={"addMembersList"}>
            {members}
          </div>
          <div className="form-group pull-right">
              <button className="btn btn-default cancel-button addMembersModalCloseBtn" onClick={this.props.onClose}>
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