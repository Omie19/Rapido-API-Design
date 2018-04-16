import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'
import { TeamHeaderComponent } from './TeamHeaderComponent';
import { CardComponent } from '../CardComponent';

export class TeamComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.alertOptions = AlertOptions;
  }


  render() {
    let statusText = <span><span className="bold-font">4</span><span className="grey-text">&nbsp;&nbsp;Memebers</span></span>
    return (
      <div>
        <div className="row main-content">
          <TeamHeaderComponent />
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">

            <CardComponent secondaryText={statusText} subtitle={"Updated : 02 19 2018"} title={"Dev Team"} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">

            <CardComponent secondaryText={statusText} subtitle={"Updated : 02 19 2018"} title={"Apps Team"} />
          </div>
        </div>
      </div>

    )
  }

}