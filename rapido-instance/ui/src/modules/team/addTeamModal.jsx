import React from 'react';
import teamService from './teamServices'

class Modal extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        teamName: '',
        teamDesc: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
    const inputs = document.getElementById("addTeamModal").querySelectorAll('input');
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
    if(refName == "teamName") {
      label = "Team Name";
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

  /* Method to submit user Details */
  handleSubmit(event) {
    event.preventDefault();
    if (this.showFormErrors()) {
      let team = {
        "name" : this.state.teamName,
        "description" : this.state.teamDesc
      }
      let teamServCreateTeamRes = null;
      teamService.createTeam(team)
        .then((response) => {
          teamServCreateTeamRes = response.clone();
          return response.json();
        })
        .then((responseData) => {
          if(teamServCreateTeamRes.ok ) {
            team["id"] = responseData.id;
            this.props.onConfirm(team);
            this.props.onClose();
          } else {
            showAlert(this, (responseData.message) ? responseData.message : "Error occured");
            if(teamServCreateTeamRes.status == 401) {
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
      height: 200,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    return (
      <div style={backdropStyle}>
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Add Team
          </h4>
          <form id="addTeamModal" className="col-md-12" noValidate>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="teamName"
                ref="teamName"
                placeholder="Team Name *"
                value={ this.state.teamName } 
                onChange={ this.handleChange }
                required />
              <div className="error" id="teamNameError"></div>
            </div>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="teamDesc"
                ref="teamDesc"
                placeholder="Team Description"
                value={ this.state.teamDesc } 
                onChange={ this.handleChange }
              />
              <div className="error" id="teamDescError"></div>
            </div>
            <div className="form-group pull-right">
              <button className="btn btn-default cancel-button" onClick={this.props.onClose}>
                Cancel
              </button>
              <button className="btn btn-default" onClick={this.handleSubmit}>
                Add
              </button>
            </div>
          </form>
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