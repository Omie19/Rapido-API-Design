import React from 'react';
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import { Link, browserHistory } from 'react-router'
import Card, { CardBlock, CardTitle } from 'mineral-ui/Card';
import Button from 'mineral-ui/Button';
import { createStyledComponent } from 'mineral-ui/styles';
import teamService from './teamServices'
import AddTeamModal from './addTeamModal';
import DeleteModal from '../d3/DeleteModal';

export default class extends React.Component{
  
  constructor(props) {
      super(props);
      this.state = {
        teamList: [],
        addTeamModalIsOpen: false,
        deleteTeamModalIsOpen: false,
        userObj: {}
      };
      this.alertOptions = AlertOptions;
      this.addTeamSuccess = this.addTeamSuccess.bind(this);
  }
  
  /* Component Initialisation */
  componentDidMount() {
    let userObj = JSON.parse(sessionStorage.getItem('user'));
    console.log(userObj);
    this.setState({
          userObj
    });
    let teamSrvGetTeamsRes = null;
    teamService.getTeams()
    .then((response) => {
      teamSrvGetTeamsRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvGetTeamsRes.ok) {
        this.setState({
          teamList: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvGetTeamsRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  addTeamToggleModal(type) {
      this.setState({
        addTeamModalIsOpen: !this.state.addTeamModalIsOpen
      });
  }

  /* Method to delete team toggle modal */
  deleteTeamToggleModal(team) {
    this.setState({
      deleteTeamModalIsOpen: !this.state.deleteTeamModalIsOpen,
      teamId: (team.team) ? team.team.id : null
    });
  }

  addTeamSuccess(team) {
    var tempTeamList = this.state.teamList;
    tempTeamList.push(team);
    this.setState({
      teamList: tempTeamList
    });
  }

  teamDetails(team) {
    sessionStorage.setItem("teamId",team.team.id);
    sessionStorage.setItem("team", JSON.stringify(team));
    browserHistory.push('/team?teamId='+team.team.id);
  }

  /* Method to delete team */
  deleteTeam() {
    let teamSrvDelTeamRes = null;
    teamService.deleteTeam(this.state.teamId)
    .then((response) => {
      teamSrvDelTeamRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvDelTeamRes.ok) {
        var tempTeamsList = this.state.teamList;
        tempTeamsList = tempTeamsList.filter(function(team){
          return team.id != responseData.id;
        });
        this.setState({
          teamList: tempTeamsList
        });
        this.deleteTeamToggleModal({});
      } else {
        this.deleteTeamToggleModal({});
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvDelTeamRes.status == 401) {
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

    const CustomContent = createStyledComponent('div', ({ theme }) => ({
      backgroundColor: theme.color_gray_20,
      margin: `${theme.space_stack_md} 0`,
      padding: theme.space_inset_lg,

      '&:last-child': {
        borderRadius: `0 0 ${theme.borderRadius_1} ${theme.borderRadius_1}`,
        marginBottom: `-${theme.space_stack_md}`
      }
    }));

    const cardLayout = createStyledComponent('div');

    const teamCards = this.state.teamList.map(function (team) {
      return (
        <Card key={team.id}>
          <CardTitle>{team.name}</CardTitle>
          <CardBlock>{team.description}</CardBlock>
          <CustomContent>
            <Button onClick={this.teamDetails.bind(this,{team})}>
              {team.ownership == 'MEMBER' ? 'View' : 'Edit'}
            </Button>
            {team.ownership != 'MEMBER' ? (
              <Button className="cardButtonSepMargin" onClick={this.deleteTeamToggleModal.bind(this,{team})}>Delete</Button>
            ) : (
              null
            )}
          </CustomContent>
        </Card>
      );
    }, this);

    var userDetailsSection = <div className="mainSection">
      <div className="nameSection">{this.state.userObj.firstname} {this.state.userObj.lastname}</div>
      <div className="emailSection">{this.state.userObj.email}</div>
    </div>

    return(
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="userDetailsSection">
        {userDetailsSection}
      </div>
      <div className="tabsContainer teamsPageTabsSection">
        <ul className="tabs teamsPageTabs">
          <li className={this.props.location.pathname === '/profile' ? 'tab teamsPageTab active-tab': 'tab teamsPageTab'}><Link to="/profile">Profile</Link></li>
          <li className={this.props.location.pathname === '/teams' ? 'tab teamsPageTab active-tab': 'tab teamsPageTab'}><Link to="/teams">Teams</Link></li>
        </ul>
      </div>
      <div className="col-md-12 teamsPageTabMainSection">
        <Button className="pull-right" onClick={this.addTeamToggleModal.bind(this)}>+ ADD TEAM</Button>
        <cardLayout className="cardLayout">
          {teamCards}
        </cardLayout>
      </div>
      <AddTeamModal show={this.state.addTeamModalIsOpen}
        onClose={this.addTeamToggleModal.bind(this)}
        onConfirm={this.addTeamSuccess}>
      </AddTeamModal>
      <DeleteModal show={this.state.deleteTeamModalIsOpen}
        onClose={this.deleteTeamToggleModal.bind(this,{})}
        onConfirm={this.deleteTeam.bind(this)}
        modalText="Are you sure you want to delete this team?">
      </DeleteModal>
      </div>
    )
  }
}