import React from 'react'
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as resolve from 'table-resolver';
import { browserHistory, Link } from 'react-router'
import { cloneDeep, findIndex, orderBy } from 'lodash';
import ProjectDetails from '../d3/ProjectDetailsComponent'
import ProjectService from '../d3/ProjectServices'
import { loadProjectDetails } from '../utils/TreeActions';
import Button from 'mineral-ui/Button';
import { showAlert, AlertOptions } from '../utils/AlertActions'
import AlertContainer from 'react-alert'
import { ThemeProvider } from 'mineral-ui/themes';
import Dropdown from 'mineral-ui/Dropdown';
import Popover from 'mineral-ui/Popover';
import AddVocabulary from './AddVocabulary';
import NodeProperties from '../d3/NodeDetailsComponent';
import CRUDSketch from '../CRUDSketch';
import ExportGithubModal from '../export/ExportGithub';
import ExportService from '../export/ExportServices'


var thisComponent;
export default class extends React.Component {

  constructor(props) {
    super(props);
    thisComponent = this;
    this.state = { 
      closeVocab : false, 
      openVocab : true,
      portalLoginForm : true,
      portalConnectingSection: false,
      portalConnectionSuccess: false,    
      githubPushSuccess: false,
      githubIntialization: false,
      searchColumn: 'all',
      selectedSketch: {},
      query: {},
      columns: [
        {
          property: 'name',
          header: {
            label: 'Vocabulary List'
          }
        },
        {
          props: {
            style: {
              width: 50
            }
          },
          cell: {
            formatters: [
              (value, { rowData }) => (
                <span
                  className="remove fa fa-times"
                  style={{ cursor: 'pointer' }}
                >

                </span>
              )
            ]
          },
          visible: true
        }
      ],
      vocabularyData: [],
      currentTreeDetails: {},
      treedata: {},
      crudComponent: {}
    };
    this.alertOptions = AlertOptions;
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePortalPublish = this.handlePortalPublish.bind(this);
    this.openPublishToPortal = this.openPublishToPortal.bind(this);

  }

  /* Component Initialisation */
  componentWillMount() {
    this.setState({
      selectedSketch: JSON.parse(sessionStorage.getItem('selectedSketch'))
    });
  }

  
  openPublishToPortal() {
    document.querySelector(".modalExportPage").style.display = "block";
  }
  
  ExportGithubToggleModal(type) {
    this.setState({
      ExportGithubModalIsOpen: !this.state.ExportGithubModalIsOpen
    });
  }  
  /* Method to get Swagger Response */
  getSwaggerResponse(download) {

    let expSrvgetSwaggerRes = null;
    let sketchId = JSON.parse(sessionStorage.getItem('sketchId'));
    ExportService.getSwaggerJSON(sketchId, download)
      .then((response) => {
        expSrvgetSwaggerRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if (expSrvgetSwaggerRes.ok) {
          if (!download) {
            this.setState({
              "apiData": JSON.stringify(responseData, null, 2),
              "downloadType": "swagger"
            });
          }
          if (download) {
            var a = document.createElement('a');
            a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(responseData, null, 2));
            a.target = '_blank';
            a.download = 'swagger.json';
            a.click();
          }
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if (expSrvgetSwaggerRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleDownload() {
    this.getSwaggerResponse(true);
  }
  getCurrentNodeDetails(component) {
    thisComponent.setState({
      currentTreeDetails: component.state.treeEditDetails,
      treedata: component.state.treedata,
      crudComponent: component,
    })
  }

  /* Method to handle edit sketch info click */
  navigateToDetails() {
    sessionStorage.setItem('sketchId', this.state.selectedSketch.projectid);
    sessionStorage.setItem('selectedSketch', JSON.stringify(this.state.selectedSketch));
    sessionStorage.setItem('sketchName', this.state.selectedSketch.name);
    sessionStorage.removeItem('vocabularyInfo');
    sessionStorage.setItem('updateMode',true)
    browserHistory.push('/nodes/add');
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

  /*Show hide Vocabulary tab*/
  showVocabulary(e) {
    e.preventDefault();
    if(this.state.closeVocab) {
      document.querySelector(".vocabulary-div-short").className = document.querySelector(".vocabulary-div-short").className.replace("vocabulary-div-short",'vocabulary-div');
      this.setState({ closeVocab: false,
                openVocab : true})
    }
    else {
      document.querySelector(".vocabulary-div").className = document.querySelector(".vocabulary-div").className.replace("vocabulary-div",'vocabulary-div-short');      
      this.setState({ closeVocab: true,
        openVocab : false})
    }
  }

  /* Render method */
  render() {
    let addOption, loadedComponent;
    let editSketchInfo;

    const VocabularyHideContent = <div className="view-text vocabulary-text vocabulary-closed-panel"><img src="/ui/src/images/bitmap.png" /></div>

    const VocabularyContent = <AddVocabulary selectedSketch={this.state.selectedSketch} />

    const myScrollbar = {
      width: "63%",
      height: "600px",
    };
    const data = [
      {
        items: [
          {
            text: 'Swagger 2.0',
          },

          {
            text: 'Swagger 3.0',
          },
          {
            text: 'Postman',
          }
        ]
      }
    ]
    
    if (this.state && this.state.selectedSketch) {

      const { searchColumn, columns, vocabularyData, query } = this.state;
      const resolvedColumns = resolve.columnChildren({ columns });

      /* Project Details Section */
      /* var projectHeader = (this.state.selectedSketch) ? <div>
         <h2>{this.state.selectedSketch["name"]}</h2>
         <h3>{this.state.selectedSketch["description"]}</h3>
         </div> : null;*/
      var sketchName = "";
      var sketchDesc = "";
      if (this.state.selectedSketch) {
        sketchName = this.state.selectedSketch["name"];
        sketchDesc = this.state.selectedSketch["description"];
      }
      const resolvedRows = resolve.resolve({
        columns: resolvedColumns,
        method: resolve.nested
      })(vocabularyData);
      const searchedRows =
        search.multipleColumns({
          columns: resolvedColumns,
          query
        })(resolvedRows);

      var vocabTable, tableList;
      if (searchedRows.length > 0) {
        tableList = <Table.Body
          ref={body => {
            this.bodyRef = body && body.getRef();
          }}
          rows={searchedRows}
          rowKey="name"
          onRow={this.onRow}
        />
      } else {
        tableList = <tbody><tr><td>No Results Found</td><td></td></tr></tbody>
      }
      vocabTable =
        <div>
          <div className="project-list-wrapper">
            <div className="col-md-12 col-sm-12">
              <Table.Provider columns={resolvedColumns} className="col-md-12 col-sm-12">
                <Table.Header
                  headerRows={resolve.headerRows({ columns })} >
                </Table.Header>
                {tableList}
              </Table.Provider>
            </div>
          </div>
        </div>

      if (query.all) {
        addOption = <input className="btn btn-default" value="Add" type="submit" />
      } else {
        addOption = <input className="btn btn-default disabled" value="Add" type="button" />
      }

      loadedComponent = <div className="vocabulary-wrapper">
        <form className="col-md-12" noValidate>
          <div className="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
            <div className="col-md-10 col-sm-10">
              <search.Field
                className="search-sketch"
                column={searchColumn}
                placeholder="vocabulary"
                query={query}
                columns={resolvedColumns}
                rows={resolvedRows}
                components={{
                  props: {
                    filter: {
                      placeholder: 'Add/Search Vocabularies'
                    }
                  }
                }}
                onColumnChange={searchColumn => this.setState({ searchColumn })}
                onChange={query => this.setState({ query })} />
            </div>
            <div className="col-md-2 col-sm-2">
              {addOption}
            </div>
          </div>
          <div className="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 vocabulary-list">
            {vocabTable}
          </div>
        </form>
      </div>
    } else {
      loadedComponent = <div className="text-center loading-project-details">Loading...</div>
    }
    
    if (this.state.selectedSketch) {    
          editSketchInfo=<div className="edit-sketch-info" onClick={this.navigateToDetails.bind(this)}>Edit Sketch Info</div>
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


    return (
      <div className="vocabulary-main-content">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="vocabulary-header">
          <div className="row xs-pl-10">
            <div className="col-md-12 edit-sketch-header">
              <div className=" col-md-6 pull-left ">
                <span className="vocabulary-header-title">{sketchName}</span>
                <span className="vocabulary-header-shared xs-pl-15">Shared with</span>
                <span className="xs-pl-10"><span className="green-status">Apps Team</span>
                  &nbsp;&nbsp;<span className="red-status">Dev Team</span>
                </span>
              </div>
              <div className="col-md-2 edit-sketch-info-wrapper">
                <div>
                  <i className="pull-left"><img src="/ui/src/images/shape-edit.png" alt="edit sketch image" /></i>
                  {/* <div className="edit-sketch-info">Edit Sketch Info</div> */}
                  {editSketchInfo}
                </div>
              </div>
              <div className="pull-right xs-pr-15 xs-pt-5">
                {/* <Button className="vocabulary-button-version" variant="regular" primary>Versions</Button>
                &nbsp;&nbsp;&nbsp;&nbsp; */}
                {/* <Button className="vocabulary-button-version" variant="regular" primary onClick={this.openPublishToPortal}>Publish to CA PORTAL </Button> */}
                <Button className="vocabulary-button-version" variant="regular" primary onClick={this.ExportGithubToggleModal.bind(this)}>Push to Github </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                  {/*  <ThemeProvider theme={{ direction: 'rtl' }}>
                  <Dropdown data={data} placement="bottom-start">
                    <Button className="vocabulary-button-preview" variant="regular" primary>Preview</Button>
                  </Dropdown>
                  </ThemeProvider> */}
                  <ExportGithubModal show={this.state.ExportGithubModalIsOpen}
                    onClose={this.ExportGithubToggleModal.bind(this)}>
                  </ExportGithubModal>
                  <div className="modalBackdropStyle modalExportPage">
                  <div className="modal col-md-12" className="modalStyle">
                    {modalContent}
                  </div>
                </div>
                
                <Button className="vocabulary-button-preview" variant="regular" onClick={this.handleDownload} primary>Preview</Button>

              </div>
            </div>
          </div>

          <div className="row xs-pl-10">
            <div className="col-md-12">
              <div className="col-md-6 pull-left view-text">
                {sketchDesc}
              </div>
            </div>
          </div>
        </div>
        <div className="row white-bg">
<div className="">

<div className="vocabulary-div">
{this.state.closeVocab && VocabularyHideContent}
<div className="vocabulary-div-panel">
{/* <AddVocabulary selectedSketch={this.state.selectedSketch} /> */}
{this.state.openVocab && VocabularyContent}
</div>
</div>
<div className="" id="sidebar">
<div className="vocabulary-text view-text"><span className="vocabulary-show-hide"><i className="vocab-arrow" onClick={this.showVocabulary.bind(this)}><img src="/ui/src/images/arrow-left.png" alt="open vocab"/></i></span>SKETCH</div>
<CRUDSketch getCurrentNodeDetails={this.getCurrentNodeDetails} />
</div>


<div className="cursor-drag">
  </div>
<div className="" id="nodeContainer">
<NodeProperties nodeData={this.state.currentTreeDetails} treedata={this.state.treedata} component={this.state.crudComponent}/>
</div>
</div>
</div>


      </div>
    );
  }
}
