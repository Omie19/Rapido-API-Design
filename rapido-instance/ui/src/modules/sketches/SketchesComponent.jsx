import React from 'react'
import SketchesFound from './SketchesFoundComponent'
import SketchService from './SketchServices'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import AddTeamModal from '../team/addTeamModal';
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {};
    this.alertOptions = AlertOptions;
    this.addTeamSuccess = this.addTeamSuccess.bind(this);
  }

  addTeamToggleModal(type) {
      this.setState({
        addTeamModalIsOpen: !this.state.addTeamModalIsOpen
      });
  }

  addTeamSuccess(team) {
    console.log(team);
  }

  /* Method to handle search */
  sortSketchCardBy(event) {
  
    /*let lastActiveId = null;
    if(document.querySelector(".sortByBtn.active")) {
      lastActiveId = document.querySelector(".sortByBtn.active").id;
      document.querySelector(".sortByBtn.active").className = document.querySelector(".sortByBtn.active").className.replace(/\bactive\b/,'');
    }
    if(lastActiveId !== event.target.id)
      event.target.className = event.target.className + " active";

    let activeNow = null;
    let activeSort = null;
    if(document.querySelector(".sortByBtn.active"))
      activeNow = document.querySelector(".sortByBtn.active").id;

    var queryResult=[];

    if(activeNow == "sortByNameBtn") {
      activeSort = 'name';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByModifiedBtn") {
      activeSort = 'modified';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.modifiedat < b.modifiedat) return -1;
        if(a.modifiedat > b.modifiedat) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByCreatedBtn") {
      activeSort = 'created';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.createdat < b.createdat) return -1;
        if(a.createdat > b.createdat) return 1;
        return 0;
      });
    }

    this.setState({
      sortType: (activeSort !== null) ? activeSort : '',
      filteredData: (activeSort !== null) ? queryResult : this.state.sketches
    })*/
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
        if(sktGetPrjSrvRes.ok) {
          this.setState({
            "sketchesData" : responseData.personal
          });
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(sktGetPrjSrvRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  navigateToMemmbers() {
    browserHistory.push('/team?teamId=13');
  }

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  /* Render Method */
  render() {

    let content; 
    
    const userNotLoggedIn =  <div className="text-center loading-project-details">Loading...</div>
    
    const sketchesNotFound = <div className="titleContainer firstTime">
      <h2>Welcome to CA API Design!</h2>
      <h3>Looks like you are getting started. Go ahead and start off with creating a new sketch or team below.</h3>
      <button onClick={this.addNewSketch.bind(this)} className="btn btn-default first-time-sketch-btn">New Sketch</button>
    </div>

    if(this.state && this.state.sketchesData ) {
      if (this.state.sketchesData && this.state.sketchesData.length > 0) {  
        content = <div className="col-md-12 sketch-component-wrapper">
          <button onClick={this.addNewSketch.bind(this)} className="btn btn-default new-sketch-btn">New Sketch</button>
          <SketchesFound sketches={this.state.sketchesData} />
        </div>
      } else {
        content = <div className="col-md-12 sketch-component-wrapper">
          {sketchesNotFound}
        </div>
      } 
    }else {
      content = <div>{userNotLoggedIn}</div>
    }
    
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {content}
        <AddTeamModal show={this.state.addTeamModalIsOpen}
          onClose={this.addTeamToggleModal.bind(this)}
          onConfirm={this.addTeamSuccess}>
        </AddTeamModal>
      </div>
    )
  }
}
