import React from 'react';
import teamService from './teamServices'
import {showAlert, AlertOptions} from '../utils/AlertActions'

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      membersList: []
    };
  }

  /* Component Initialisation */
  componentDidMount() {
    let teamSrvGetTeamRes = null;
    let teamId = sessionStorage.getItem('teamId');
    teamService.getTeam(teamId)
    .then((response) => {
      teamSrvGetTeamRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvGetTeamRes.ok) {
        this.setState({
          membersList: responseData.memebers
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvGetTeamRes.status == 401) {
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
      height: 200,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    const members = this.state.membersList.map(function (member) {
      return (
        <div>
          {member.id}
        </div>
      );
    }, this);

    return (
      <div style={backdropStyle}>
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Members List
          </h4>
          {members}
          <div className="form-group">
              <button className="btn btn-default" onClick={this.props.onClose}>
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