import React from 'react'
import { browserHistory } from 'react-router'
import { addEmptySketch, createSketch, exportDesign } from '../utils/TreeActions';
import ProjectService from '../d3/ProjectServices'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'
import Button from 'mineral-ui/Button';
import { Link } from "react-router";
import TextInput from 'mineral-ui/TextInput';
import TextArea from 'mineral-ui/TextArea';

var component;


export default class extends React.Component {

  constructor(props) {
    super(props);
    component = this;
    this.state = {
      projectInfo: {
        projectName: '',
        projectDesc: ''
      },
      sketchType: true
    };
    this.alertOptions = AlertOptions;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    let projectInfo = JSON.parse(sessionStorage.getItem('selectedSketch'));    
    let teamId = JSON.parse(sessionStorage.getItem('teamId'));
    let updateMode = sessionStorage.getItem("updateMode")
   
    if (teamId) {
      this.setState({
        teamId: teamId
      })
    }
    if (updateMode == "true") {
      if (projectInfo) {
        this.setState({
          teamId: teamId
        })
      }
    }
    if (updateMode == "true") {
  
      if (projectInfo) {
        this.setState({
          projectInfo: {
            projectName: projectInfo.name,
            projectDesc: projectInfo.description
          }

        })
      }
    } else {
      this.setState({
        projectInfo: {
          projectName: "",
          projectDesc: ""
        }
      })
    }
    // sessionStorage.setItem('updateMode', false)
  }

  /* Method to fetch child upon tree selection */
  fetchChild(parent, fetch, childrenFn) {
    if (!parent) return;
    fetch(parent);
    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        component.fetchChild(children[i], fetch, childrenFn);
      }
    }
  }

  /* Method to update Active state for Tree */
  setActiveStatus(activeObj) {
    component.fetchChild(activeObj, function (d) {
      d.active = false;
      if (d.children) {
        d.children.forEach((item, index) => {
          item.pId = d.pId + (index + 1);
          item.active = false;
        })
      }
    },
      function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
      });
  }

  /* Method to Export Sketch Data */
  exportSketchInfo() {
    exportDesign(component.state);
  }

  /* Method to Show Alert Message */
  showAlert(message) {
    showAlert(this, message)
    setTimeout(function () {
      this.msg.removeAll()
    }.bind(this), 3000);
  }

  /* Method to submit project Details */
  handleSubmit(event) {
    event.preventDefault();
    let updateMode = sessionStorage.getItem("updateMode")    
    let sketchId = sessionStorage.getItem('sketchId')
    let updatedSketchInfo = JSON.parse(sessionStorage.getItem('selectedSketch'));

    if (sketchId != "null") {
      var projectInfo = this.state.projectInfo;
      if (this.showFormErrors()) {
        var updatedSkecthDetails = {}
        let prjSrvSketchUpdateRes= null;
        updatedSkecthDetails.name = projectInfo.projectName;
        updatedSkecthDetails.description = projectInfo.projectDesc;
        updatedSkecthDetails.id =  sketchId;
        ProjectService.updateProject(updatedSkecthDetails)
          .then((response) => {
            prjSrvSketchUpdateRes = response.clone();
            return response.json();
          })
          .then((responseData) => {
            if (prjSrvSketchUpdateRes.ok) {
              for (var key in updatedSketchInfo) {
                if (key === "name") { updatedSketchInfo[key] = this.state.projectInfo.projectName; }
                if (key === "description") { updatedSketchInfo[key] = this.state.projectInfo.projectDesc; }
              }
              sessionStorage.setItem('selectedSketch', JSON.stringify(updatedSketchInfo))
              sessionStorage.setItem('projectInfo', JSON.stringify(this.state.projectInfo))
              browserHistory.push('/vocabulary');
            } else {
              showAlert(this, (responseData.message) ? responseData.message : "Error occured");
            }
          })
      }
    } else {
      if (this.showFormErrors()) {
        var projectInfo = this.state.projectInfo;
        addEmptySketch(this, []);
        component.setActiveStatus(component.state.treedata);
        component.state.projectDetails.projectName = projectInfo.projectName;
        component.state.projectDetails.projectDesc = projectInfo.projectDesc;
        /* TODO Promise */
        createSketch(component, [], ProjectService, browserHistory)

      }
    }

    // }

  }


  /* Method to handle Form Input change */
  handleChange(field, event) {
    event.target.classList.add('active');
    if (this.state.projectInfo == undefined) {
      this.state = {
        projectInfo: {
          projectName: '',
          projectDesc: ''
        }
      }
    }
    if (event.target.name === 'projectName') {
      this.setState({
        projectInfo: {
          projectName: event.target.value,
          projectDesc: this.state.projectInfo.projectDesc
        }
      });
      this.showInputError(event.target.name);
    } else if (event.target.name === 'projectDesc') {
      this.setState({
        projectInfo: {
          projectName: this.state.projectInfo.projectName,
          projectDesc: event.target.value
        }
      });
    }
  }

  /* Method to show form submission validation errors */
  showFormErrors() {
    const inputs = document.getElementById('projectDetailsNode').querySelectorAll('#InputprojectName');
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

  /* Method to handle input field change errors*/
  showInputError(refName) {
    const validity = this.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    const isPassword = refName.indexOf('password') !== -1;
    const isProjectName = refName === 'projectName';

    if (isProjectName) {
      if (this.refs.projectName.value.length > 35) {
        this.refs.projectName.setCustomValidity('projectName Field exceeded 35 characters limit');
      } else {
        this.refs.projectName.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`;
      } else if (isProjectName && validity.customError) {
        error.textContent = 'projectName Field exceeded 35 characters limit';
      }
      return false;
    }

    error.textContent = '';
    return true;
  }

  handleSketchType(event) {
    this.setState({
      sketchType: !this.state.sketchType
    })
    if (event.target.value === "shared") {
      document.getElementById("sharedDiv").style.display = "block";
      document.getElementById("personalDiv").style.display = "none";
    }
    else {
      document.getElementById("sharedDiv").style.display = "none";
      document.getElementById("personalDiv").style.display = "block";
    }
  }

  /* Render Method */
  render() {
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="row sketch-border">
          <div className="col-md-12 sketch-header">
            <div className="col-md-2 sketches-text">
              New Sketch
          </div>
          </div>
        </div>
        <div className="col-md-8 create-project-section" id="projectDetailsNode">
          <form className="col-md-8" noValidate onSubmit={this.handleSubmit}>
            <div className="col-md-12">
              <label className="Sketch-Name" htmlFor="InputprojectName" id="projectNameLabel">Sketch Type</label>

              <div className="switch">
                <input type="radio" className="switch-input" name="view" value="personal" id="personal" checked={this.state.sketchType} onChange={this.handleSketchType.bind(this)} />
                <label htmlFor="personal" className="switch-label">Personal</label>
                <input type="radio" className="switch-input" name="view" value="shared" id="shared" checked={!this.state.sketchType} onChange={this.handleSketchType.bind(this)} />
                <label htmlFor="shared" className="switch-label">Shared</label>

              </div>
            </div>
            <div id="personalDiv" className="col-md-12 next-section">
              <div className="form-group">
                <label className="Sketch-Name" htmlFor="InputprojectName" id="projectNameLabel">Sketch Name</label>
                <input
                  type="text"
                  value={this.state.projectInfo.projectName}
                  className="Rectangle-5 form-control"
                  id="InputprojectName"
                  name="projectName"
                  ref="projectName"
                  onChange={this.handleChange.bind(this, 'projectName')}
                  required />

                <div className="error" id="projectNameError" ></div>
              </div>
              <div className="form-group">
                <label className="Description" htmlFor="InputProjectDesc" id="projectDescLabel">Description</label>
                <TextArea
                  size="medium"
                  value={this.state.projectInfo.projectDesc}
                  className="Rectangle-5-Copy"
                  id="InputProjectDesc"
                  name="projectDesc"

                  onChange={this.handleChange.bind(this, 'projectDesc')}
                />
              </div>
            </div>
            <div id="sharedDiv" className="col-md-12 next-section displayNone">
              <div className="form-group">
                <label className="Sketch-Name" htmlFor="InputprojectName" id="projectNameLabel">Sketch Name</label>
                <input
                  type="text"
                  className="Rectangle-5 form-control"
                  required />
              </div>
            </div>
            <div className="col-md-8 pull-right button-section">

              <Button className="new-sketch-text pull-right" variant="regular" onClick={this.handleSubmit} primary>Proceed</Button>
              <Link to="/sketches"><Button className="pull-right Rectangle-4-Copy-6">Cancel</Button></Link>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

