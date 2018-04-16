import React from 'react';
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import { Link, browserHistory } from 'react-router'
import AddMemberModal from './addMemberModal';
import Button from 'mineral-ui/Button';
import teamService from './teamServices'
import Card, { CardBlock, CardTitle } from 'mineral-ui/Card';
import { createStyledComponent } from 'mineral-ui/styles';
import DeleteModal from '../d3/DeleteModal';

export default class extends React.Component{
  
  constructor(props) {
      super(props);
      this.state = {
        addMemberModalIsOpen: false,
        deleteMemberModalIsOpen: false,
        membersList: [],
        teamAccessOnMember: ''
      };
      this.alertOptions = AlertOptions;
      this.addMemberSuccess = this.addMemberSuccess.bind(this);
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
        this.setState({
          teamAccessOnMember: responseData.access
        })
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

  /* Method to handle input change */
  handleChange(e, member) {
    member = member.member
    var selectedAccess = e.target.value;
    member.access = selectedAccess;
    let teamSrvEditTeamMemRes = null;
    let teamId = sessionStorage.getItem('teamId');
    teamService.editTeamMember(teamId,member)
    .then((response) => {
      teamSrvEditTeamMemRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvEditTeamMemRes.ok) {
        var tempMembersList = this.state.membersList;
        var selectedMember = member;
        tempMembersList.filter(function(member){
          if(member.id == selectedMember.id)
            member.access = selectedAccess;
        });
        this.setState({
          membersList: tempMembersList
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvEditTeamMemRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to delete team toggle modal */
  deleteMemberToggleModal(member) {
    if(this.props.location.query.teamId) {
      sessionStorage.setItem("teamId",this.props.location.query.teamId)
    }
    this.setState({
      deleteMemberModalIsOpen: !this.state.deleteMemberModalIsOpen,
      memberId: (member.member) ? member.member.id : null
    });
  }

  addMemberToggleModal() {
    if(this.props.location.query.teamId) {
      sessionStorage.setItem("teamId",this.props.location.query.teamId)
    }
    this.setState({
      addMemberModalIsOpen: !this.state.addMemberModalIsOpen
    });
  }

  /* Method to add member success */
  addMemberSuccess(member) {
    var tempMemberList = this.state.membersList;
    tempMemberList.push(member);
    this.setState({
      membersList: tempMemberList
    });
  }

  /* Method to delete member */
  deleteMember() {
    let teamSrvDelMemRes = null;
    let teamId = sessionStorage.getItem('teamId');
    teamService.deleteTeamMember(teamId,this.state.memberId)
    .then((response) => {
      teamSrvDelMemRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvDelMemRes.ok) {
        var tempMembersList = this.state.membersList;
        tempMembersList = tempMembersList.filter(function(member){          
          return member.id != responseData.id;
        });
        this.setState({
          membersList: tempMembersList
        });
        this.deleteMemberToggleModal({});
      } else {
        this.deleteMemberToggleModal({});
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvDelMemRes.status == 401) {
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

    const cardLayout = createStyledComponent('div');

    const CustomContent = createStyledComponent('div', ({ theme }) => ({
      backgroundColor: theme.color_gray_20,
      margin: `${theme.space_stack_md} 0`,
      padding: theme.space_inset_lg,

      '&:last-child': {
        borderRadius: `0 0 ${theme.borderRadius_1} ${theme.borderRadius_1}`,
        marginBottom: `-${theme.space_stack_md}`
      }
    }));


    const members = this.state.membersList.map(function (member) {
      return (
        <Card key={member.id}>
          <CardTitle>{member.email}</CardTitle>
          <CardBlock>{member.access}</CardBlock>
          {this.state.teamAccessOnMember != 'MEMBER' ? (
            <CustomContent>
              <select className="access-dropdown" value={member.access} onChange={(e) => this.handleChange(e, {member})}>
                <option value="OWNER">Owner</option>
                <option value="MEMBER">Member</option>
              </select>
              <Button onClick={this.deleteMemberToggleModal.bind(this,{member})}>Delete</Button>
            </CustomContent>
          ) : (
            null
          )}
        </Card>
      );
    }, this);

    const selectedTeam =  JSON.parse(sessionStorage.getItem('team')).team;

    const addMemberBtn = (this.state.teamAccessOnMember != "MEMBER") ? <Button className="pull-right" onClick={this.addMemberToggleModal.bind(this)}>+ ADD MEMBER</Button> : null;

    console.log(selectedTeam);

    var teamDetailsSection = <div className="mainSection">
      <div className="nameSection">{selectedTeam.name}</div>
      <div className="emailSection">{selectedTeam.description}</div>
    </div>

    return(
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="teamDetailsSection">
        {teamDetailsSection}
      </div>
      <div className="col-md-12 teamDetailsMainSection">
        {addMemberBtn}
        <cardLayout className="cardLayout">
          {members}
        </cardLayout>
      </div>
      <AddMemberModal show={this.state.addMemberModalIsOpen}
        onClose={this.addMemberToggleModal.bind(this)}
        onConfirm={this.addMemberSuccess}>
      </AddMemberModal>
      <DeleteModal show={this.state.deleteMemberModalIsOpen}
        onClose={this.deleteMemberToggleModal.bind(this,{})}
        onConfirm={this.deleteMember.bind(this)}
        modalText="Are you sure you want to delete this member?">
      </DeleteModal>
      </div>
    )
  }
}