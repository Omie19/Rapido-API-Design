import React from 'react';
import ProjectService from '../d3/ProjectServices'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import AlertContainer from 'react-alert'


class Modal extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        repoName: '',
        commitMessage: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.alertOptions = AlertOptions;
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
    const inputs = document.getElementById("exportGitHubModal").querySelectorAll('input');
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
    if(refName == "repoName") {
      label = "Repo Name";
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
      let prjServpublishToGithub = null;
      ProjectService.publishToGithub(this.state.repoName, this.state.commitMessage, sessionStorage.getItem('sketchId'))
        .then((response) => {
          prjServpublishToGithub = response.clone();
          return response.json();
        })
        .then((responseData) => {
          if(prjServpublishToGithub.ok ) {
            showAlert(this, "Push to GitHub Successful");
            this.props.onClose();
          } else {
            showAlert(this, (responseData.message) ? responseData.message : "Error occured");
            if(prjServpublishToGithub.status == 401) {
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
      height: 250,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    return (
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div style={backdropStyle}>
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Push To GitHub
          </h4>
          <form id="exportGitHubModal" className="col-md-12 pushToGithub" noValidate>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="repoName"
                ref="repoName"
                placeholder="Repo Name *"
                value={ this.state.repoName } 
                onChange={ this.handleChange }
                required />
              <div className="inputNoteMessage">Enter existing GitHub Repo Name</div>
              <div className="error" id="repoNameError"></div>
            </div>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="commitMessage"
                ref="commitMessage"
                placeholder="Commit Message"
                value={ this.state.commitMessage } 
                onChange={ this.handleChange }
              />
              <div className="error" id="commitMessageError"></div>
            </div>
            <div className="form-group pull-right">
              <button className="btn btn-default cancel-button" onClick={this.props.onClose}>
                Cancel
              </button>
              <button className="btn btn-default" onClick={this.handleSubmit}>
                Commit
              </button>
            </div>
          </form>
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