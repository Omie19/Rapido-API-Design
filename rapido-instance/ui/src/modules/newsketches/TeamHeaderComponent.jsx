import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'

export class TeamHeaderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.alertOptions = AlertOptions;
  }


  render() {

    return (

      <div className="team-search-bar">
        <div className="team-search-text col-md-8">Team</div>

        <div className="new-team-button col-md-2">
          <div className="new-team-text">New Team</div>
        </div>

      </div>

    )
  }

}