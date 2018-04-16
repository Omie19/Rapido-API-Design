import React from 'react'
import { browserHistory } from 'react-router'
import InlineEdit from 'react-edit-inline';
import ProjectService from './ProjectServices'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      projectInfo: {
        projectName: '',
        projectDesc: ''
      },
      projectUpdatedInfo: {
        projectName: '',
        projectDesc: ''
      }
    };
    this.alertOptions = AlertOptions;
    this.dataChanged = this.dataChanged.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {    
   let projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
    if(projectInfo) {
      this.setState({
        projectInfo: {
          projectName: projectInfo.projectName,
          projectDesc: projectInfo.projectDesc
        },
        projectUpdatedInfo: {
          projectName: projectInfo.projectName,
          projectDesc: projectInfo.projectDesc
        }
      })
      if(projectInfo.projectName) {
        this.props.setProjectHeader(projectInfo, false)
      } else {
        this.props.setProjectHeader(projectInfo, true)
      }
    } else {
      this.setState({
        projectInfo: this.props.projectHeaders,
        projectUpdatedInfo: this.props.projectHeaders
      })
    }
  }

  /* Method to Submit Project Details */
  submitProjectHeaders(obj) {
    let sketchId = sessionStorage.getItem('sketchId');
    if(sketchId === 'null') {
      sessionStorage.setItem('projectInfo',JSON.stringify(this.state.projectUpdatedInfo))
      if(this.state.projectUpdatedInfo.projectName) {
        this.props.setProjectHeader(this.state.projectUpdatedInfo, false)
      } else {
        this.props.setProjectHeader(this.state.projectUpdatedInfo, true)
      }
    } else {
      let projectHeadersObj = {
        "id" : obj.projectId,
        "name" : obj.projectName,
        "description" : obj.projectDesc
      }
      ProjectService.updateProjectHeaders(projectHeadersObj)
        .then((response) => response.json())
        .then((responseData) => {
          if(responseData.status === 'Success') {
            showAlert(this, "Saving project details")
            this.props.setProjectHeader(this.state.projectUpdatedInfo, false);
            setTimeout(function(){
              this.msg.removeAll()
            }.bind(this), 3000);
          } else {
            showAlert(this, responseData.message.errMsg)
            if(responseData.message.errId && responseData.message.errId == "1001"){
              browserHistory.push('/login');
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /* Method to Update Changed data */
  dataChanged(field, data) {
    if(field === 'name') {
      if(data.projectName.length>0) {
        this.setState({
          projectInfo: {
            projectName: data.projectName,
            projectDesc: this.state.projectInfo.projectDesc
          }
        })
        this.state.projectUpdatedInfo.projectName = data.projectName;
        this.state.projectUpdatedInfo.projectDesc = this.state.projectInfo.projectDesc;
        this.submitProjectHeaders(this.state.projectUpdatedInfo);
      } else {
        this.props.setProjectHeader(this.state.projectUpdatedInfo, true)
      }
    } else {
      this.setState({
        projectInfo: {
          projectName: this.state.projectInfo.projectName,
          projectDesc: data.projectDesc
        }
      })
      this.state.projectUpdatedInfo.projectName = this.state.projectInfo.projectName;
      this.state.projectUpdatedInfo.projectDesc = data.projectDesc;
      this.submitProjectHeaders(this.state.projectUpdatedInfo);
    }
  }

  /* Method to Validate Project Details */
  customValidateText(field, text) {
    if(text.length == 0) {
      if(field == 'projectName') {
        this.setState({
          projectInfo: {
            projectName: '',
            projectDesc: this.state.projectInfo.projectDesc
          }
        })
        this.dataChanged('name',{projectName: ''})
      } else {
        this.setState({
          projectInfo: {
            projectName: this.state.projectInfo.projectName,
            projectDesc: ''
          }
        })
        this.dataChanged('desc',{projectDesc: ''})
      }
    } else {
      return (text.length > 0 && text.length < 64);
    }
  }

  /* Render Method */
  render() {
    return(
      <div className="col-md-8" id="projectDetailsNode">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="col-md-6 project-details name">
          <InlineEdit
            validate={this.customValidateText.bind(this,'projectName')}
            placeholder= "Project Name"
            activeClassName="editing"
            className = {this.state.projectInfo.projectName ? 'active-name' : 'inactive-name'}
            text={this.state.projectInfo.projectName}
            paramName="projectName"
            change={this.dataChanged.bind(this,'name')}
            style={{
              minWidth: 150,
              display: 'inline-block',
              margin: 0,
              padding: 0,
              fontSize: 15,
              outline: 0
            }}
          />
        </div>
        <div className="col-md-6 project-details description">
          <InlineEdit
            validate={this.customValidateText.bind(this,'projectDesc')}
            activeClassName="editing"
            placeholder= "Project Description"
            text={this.state.projectInfo.projectDesc}
            className = {this.state.projectInfo.projectDesc ? 'active-desc' : 'inactive-desc'}
            paramName="projectDesc"
            change={this.dataChanged.bind(this,'desc')}
            style={{
              minWidth: 150,
              display: 'inline-block',
              margin: 0,
              padding: 0,
              fontSize: 15,
              outline: 0
            }}
          />
        </div>
      </div>
    )
  }
}
