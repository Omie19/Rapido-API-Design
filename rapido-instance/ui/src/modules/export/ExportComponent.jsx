import React from 'react'
import AceEditor from 'react-ace'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import ExportService from './ExportServices'
import ProjectService from '../d3/ProjectServices'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import 'brace/mode/json'
import 'brace/theme/github'
import apiObj from '../utils/ApiServices'
import ExportGithubModal from './ExportGithub'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      options : [
        { exportType: 'Swagger', label: 'Swagger 2.0'},
        { exportType: 'Postman', label: 'Postman'},
      ],
      oauthOptions: [
        { oauthType: 'oauthEnabled', label: 'oauth Enabled'},
        { oauthType: 'oauthDisabled', label: 'oauth Disabled'},
      ],
      "oauthType": "oauthEnabled",
      "exportType":"Swagger",
      projectDetailsData: {},
      portalLoginForm : true,
      portalConnectingSection: false,
      portalConnectionSuccess: false,
      githubPushSuccess: false,
      githubIntialization: false,
    };
    this.alertOptions = AlertOptions;
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePortalPublish = this.handlePortalPublish.bind(this);
    this.openPublishToPortal = this.openPublishToPortal.bind(this);
  }

  ExportGithubToggleModal(type) {
      this.setState({
        ExportGithubModalIsOpen: !this.state.ExportGithubModalIsOpen
      });
  }

  /* Component Initialisation */
  componentDidMount() {
    this.getSwaggerResponse(false);
    let sketchId = sessionStorage.getItem('sketchId');
    let prjSrvGetPrjDetRes = null;
    ProjectService.getProjectDetails(sketchId)
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
         if(prjSrvGetPrjDetRes.ok) {
        this.setState({
          projectDetailsData: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDetRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to get Swagger Response */
  getSwaggerResponse (download) {
    let expSrvgetSwaggerRes = null;
    let sketchId = JSON.parse(sessionStorage.getItem('sketchId'));
    ExportService.getSwaggerJSON(sketchId,download)
      .then((response) => {
        expSrvgetSwaggerRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
       
        if(expSrvgetSwaggerRes.ok) {
          if(!download) {
            this.setState({
              "apiData" : JSON.stringify(responseData, null, 2),
              "downloadType": "swagger"
            });
          }
          if(download) {
            var a = document.createElement('a');
            a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(responseData, null, 2));
            a.target = '_blank';
            a.download = 'swagger.json';
            a.click();
          }
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(expSrvgetSwaggerRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Method to get PostMan Response */
  getPostManResponse(download) {
    let expSrvgetPostmanRes = null;
    let sketchId = JSON.parse(sessionStorage.getItem('sketchId'));
    ExportService.getPostmanJSON(sketchId,download)
    .then((response) => {
      expSrvgetPostmanRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(expSrvgetPostmanRes.ok) {
        if(!download) {
          this.setState({
            "apiData" : JSON.stringify(responseData, null, 2),
            "downloadType": "postman"
          });
        }
        if(download) {
          var a = document.createElement('a');
          a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(responseData, null, 2));
          a.target = '_blank';
          a.download = 'postman.json';
          a.click();
        }
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(expSrvgetPostmanRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to handle download swagger or postman*/
  handleDownload() {
    if(this.state.downloadType === 'postman') {
      this.getPostManResponse(true);
    } else {
      this.getSwaggerResponse(true);
    }
  }

  /* Method to select export type */
  changeExportType(val) {
    this.setState({
      exportType: val.exportType
    });
    if(val.exportType === 'Postman') {
      this.getPostManResponse(false);
    } else {
      this.getSwaggerResponse(false);
    }
  }

  changeOauthType(val) {
    this.setState({
      oauthType: val.oauthType
    });
  }

  openPublishToPortal() {
    document.querySelector(".modalExportPage").style.display = "block";
  }


  handlePortalPublish(event) {
    // TODO remove this only for demo
    event.preventDefault();
    this.setState({
      portalLoginForm : false,
      portalConnectingSection: true,
      portalConnectionSuccess: false,
      githubPushSuccess: false,
      githubIntialization: false,
    });
    setTimeout(() => {
      this.setState({
        portalLoginForm : false,
        portalConnectingSection: false,
        portalConnectionSuccess: true,
        githubPushSuccess: false,
        githubIntialization: false,
      });
    }, 5000);
    setTimeout(() => {
      this.setState({
        portalLoginForm : true,
        portalConnectingSection: false,
        portalConnectionSuccess: false,
        githubPushSuccess: false,
        githubIntialization: false,
      });
      document.querySelector(".modalExportPage").style.display = "none";
    }, 8000);
  }

  /* Render Method */
  render() {
    let exportComponent;
    var selectedSketch = JSON.parse(sessionStorage.getItem('selectedSketch'));
    var projectHeader = (selectedSketch) ? <div>
      <h2>{selectedSketch["name"]}</h2>
      <h3>{selectedSketch["description"]}</h3>
      </div> : null;

    if(this.state && this.state.apiData ) {
      exportComponent = 
        <div>
          <div className="col-md-12">
            <div className="row">
              <div className="exportPageHeader">Settings</div>
              <form className="col-md-3 exportSettingsForm" noValidate onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <Select
                    name="form-field-name"
                    value={this.state.oauthType}
                    valueKey='oauthType'
                    options={this.state.oauthOptions}
                    onChange={this.changeOauthType.bind(this)}
                  />
                </div>
              </form>
            </div>
            <div className="row">
              <div className="exportPageHeader">Download Options</div>
              <div className="otherExportSettings">
                <div className="col-md-3">
                  <Select
                    name="form-field-name"
                    value={this.state.exportType}
                    valueKey='exportType'
                    options={this.state.options}
                    onChange={this.changeExportType.bind(this)}
                  />
                </div>
                <div className="col-md-3">
                  <button onClick={ this.handleDownload } className="btn btn-default">Download JSON</button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="exportPageHeader">Publish Options</div>
              <div className="otherExportSettings">
                <div className="col-md-2">
                  <button className="btn btn-default" onClick={this.openPublishToPortal}>Publish to CA PORTAL</button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-default" onClick={this.ExportGithubToggleModal.bind(this)}>Push to GitHub</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    } else {
      exportComponent = <div className="text-center loading-project-details">Loading...</div>
    }

    let modalContent;
    if(this.state.portalLoginForm) {
      modalContent = <div className="portalLoginForm">
            <h4 className="text-center">
              Publish To CA Portal
            </h4>
            <form id="addTeamModal" className="col-md-12" noValidate>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="portalUserName"
                ref="portalUserName"
                placeholder="Portal User Name"
              />
            </div>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="portalPassword"
                ref="portalPassword"
                placeholder="Portal Password"
              />
            </div>
            <div className="form-group">
              <input className="form-control"
                type="text"
                name="portalURL"
                ref="portalURL"
                placeholder="Portal URL"
              />
            </div>
            <div className="form-group pull-right">
              <button className="btn btn-default" onClick={this.handlePortalPublish}>
                Publish
              </button>
            </div>
            </form>
          </div>;
    } else if(this.state.portalConnectingSection) {
      modalContent = <div className="portalConnectionSection">
            <h4 className="portalPublishConnetionStatus">Connecting to Portal...</h4>
          </div>;
    } else if(this.state.portalConnectionSuccess) {
      modalContent = <div className="portalConnectionSuccess">
            <h4 className="portalPublishConnetionStatus">Connection successful, Publishing to CA PORTAL.</h4>
          </div>;
    } else if(this.state.githubIntialization) {
      modalContent = <div className="githubIntialization">
            <h4 className="githubIntializationText">Connecting to GitHub, Validating..</h4>
          </div>;
    } else if(this.state.githubPushSuccess) {
      modalContent = <div className="githubPushSuccess">
            <h4 className="githubPushSuccessText">Push to GitHub, Successful.</h4>
          </div>;
    }

    return (<div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="titleContainer sketchPage">
        {projectHeader}
      </div>
      <div className="tabsContainer">
        <ul className="tabs">
          <li className={this.props.location.pathname === '/vocabulary' ? 'tab active-tab': 'tab'}><Link to="/vocabulary">VOCABULARY</Link></li>
          <li className={this.props.location.pathname === '/nodes/edit' ? 'tab active-tab': 'tab'}><Link to="/nodes/edit">SKETCH</Link></li>
          <li className={this.props.location.pathname === '/export' ? 'tab active-tab': 'tab'}><Link to="/export">EXPORT</Link></li>
        </ul>
      </div>
      <div className="col-md-12 sketch-list-wrapper">
        {exportComponent}
      </div>
      <ExportGithubModal show={this.state.ExportGithubModalIsOpen}
          onClose={this.ExportGithubToggleModal.bind(this)}>
      </ExportGithubModal>
      <div className="modalBackdropStyle modalExportPage">
        <div className="modal col-md-12" className="modalStyle">
          {modalContent}
        </div>
      </div>
    </div>)
  }
}
