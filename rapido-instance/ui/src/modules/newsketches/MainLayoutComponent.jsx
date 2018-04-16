import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions';
import { SketchesComponent } from "./SketchesComponent";
import { TeamComponent } from "./TeamComponent";
import SketchService from './SketchServices'

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.alertOptions = AlertOptions;
    }

    /* Component Initialisation */
    componentDidMount() {
        let userDetails = JSON.parse(sessionStorage.getItem('user'));
        let sktGetPrjSrvRes = null;
        SketchService.getProjects(userDetails.id)
            .then((response) => {
                sktGetPrjSrvRes = response.clone();
                return response.json();
            })
            .then((responseData) => {
                if (sktGetPrjSrvRes.ok) {
                    this.setState({
                        "sketchesData": responseData.personal,
                        "sketchesDataLength":responseData.personal.length,
                        "teamLength":Object.keys(responseData.team).length
                    });
                } else {
                    showAlert(this, (responseData.message) ? responseData.message : "Error occured");
                    if (sktGetPrjSrvRes.status == 401) {
                        sessionStorage.removeItem('user')
                        sessionStorage.removeItem('token')
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div className="col-md-12 main-content main-content-padding">
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                <div className="col-md-12">  
                <div className="col-md-1 main-sidebar-content xs-p-0">
                    <div className="active-box">
                        <span className="row active-content-text">
                            SKETCHES
                        </span>
                        <span className="row active-content-count">
                        {this.state.sketchesDataLength}
                        </span>
                    </div>
                    <div className="inactive-box">
                        <span className="row inactive-content-text">
                            TEAMS
                        </span>
                        <span className="row active-content-count">
                        {this.state.teamLength}
                        </span>
                    </div>
                </div> 
                <div className="col-md-11 xs-p-0">             
                <SketchesComponent sketches={this.state.sketchesData}/>
                </div>
                </div>
               {/* <div className="col-md-3">
                    <TeamComponent />
                </div>
            */} 

            </div>




        )
    }

}