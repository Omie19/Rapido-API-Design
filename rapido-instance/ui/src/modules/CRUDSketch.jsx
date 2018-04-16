import React from 'react'
import CRUDTree from './d3/CRUDTreeComponent'
import NodeDetails from './d3/NodeDetailsComponent'
import ProjectService from './d3/ProjectServices'
import EditObserver from './EditObserver'
import { browserHistory, Link } from 'react-router'
import AlertContainer from 'react-alert'
import { AlertOptions, showAlert } from './utils/AlertActions'
import { showDetails, addNode, deleteNode, updateTreeData, updateProjectHeaders, addEmptySketch, loadProjectDetails, createSketch, updateSketch, updatePath, exportDesign, importDesign } from './utils/TreeActions';

var component;

export default class extends React.Component {

  constructor(props) {
    super(props);
    component = this;
    // add an observer for the child edit view
    this.alertOptions = AlertOptions;
    let observer = new EditObserver();
    observer.nullifyObserver();

    let addObserver = function (event) {
      if (event.id === "export") {
        if (component.state && component.state.projectSaved) {
          browserHistory.push('/export');
        } else {
          component.showAlertMessage("Please save the sketch details to Export ")
          setTimeout(function () {
            this.msg.removeAll()
          }.bind(component), 3000);
        }
      }
    }
    observer.addObserver(addObserver)
  }

  /* Component Initialisation */
  componentWillMount() {

    let sketchId = sessionStorage.getItem('sketchId');
    if (sketchId === 'null') {
      addEmptySketch(this)
    } else {
      loadProjectDetails(ProjectService, this, sketchId);
      // this.props.getNodeDetails(component);
    }
  }

  /* Tree Click Handler */
  onClick(event, eventData) {
    if (event.name === "detail") {
      //alert(event.source.pId)
      updatePath(component, event);
      showDetails(component, event);

    } else if (event.name === "add") {
      addNode(component, event)
    } else if (event.name === "delete") {
      // alert(event.source.pId)
      deleteNode(component, ProjectService,browserHistory,event);
    } else if (event.name === "updatePath") {
      //alert(event.source.pId)
      updatePath(component, event)
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

  /* Method to show selected node
   details */
  showDetailsSection(nodeData) {
    if (nodeData.rootNode) {
      component.setState({
        treeEditDetails: {
          rootNodeData: nodeData,
          vocabulary: component.state.vocabulary
        }
      })
      this.props.getCurrentNodeDetails(component);
    } else {
      component.setState({
        treeEditDetails: {
          childNodeData: nodeData,
          vocabulary: component.state.vocabulary,
          apiExportData: component.state.apidetails
        }
      })
      this.props.getCurrentNodeDetails(component);
    }
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

  /* Method to Submit Sketch Details */
  submitSketchDetails() {
    component.setActiveStatus(component.state.treedata);
    let savedVocabulary;
    let userDetails = JSON.parse(sessionStorage.getItem('userInfo'));
    let VocabularyStored = sessionStorage.getItem('vocabularyInfo')
    if (VocabularyStored) {
      savedVocabulary = JSON.parse(VocabularyStored);
    } else {
      savedVocabulary = []
    }
    createSketch(component, savedVocabulary, ProjectService, browserHistory)
  }



  /* Method to Export Sketch Data */
  exportSketchInfo() {
    exportDesign(component.state);
  }

  /* Method to Import Sketch Data */
  importSketchInfo(data) {
    return importDesign(data);
  }

  /* Method to Show Alert Message */
  showAlertMessage(message) {
    showAlert(this, message)
    setTimeout(function () {
      this.msg.removeAll()
    }.bind(this), 3000);
  }

  /* Method to navigate to tree Node details */
  getNodeDetails() {
    let sketchId = sessionStorage.getItem('sketchId')
    if (sketchId !== 'null') {
      browserHistory.push('/nodes/edit');
    } else {
      let sketchMode = JSON.parse(sessionStorage.getItem('updateMode'));
      if (sketchMode) {
        browserHistory.push('/nodes/edit');
      } else {
        browserHistory.push('/nodes/add');
      }
    }
  }
  
  /* Render Method */
  render() {
    
    var selectedSketch = JSON.parse(sessionStorage.getItem('selectedSketch'));

    /* Project Details Section */
    var projectHeader = (selectedSketch) ? <div>
      <h2>{selectedSketch["name"]}</h2>
      <h3>{selectedSketch["description"]}</h3>
    </div> : null;

    var projectNodeDetails, saveSketch, createProjectOption, loadedComponent
    if (this.state) {

      /*projectNodeDetails = <div className="col-xs-12 node-details-section">
          <NodeDetails nodeData={this.state.treeEditDetails} updatedData={(val,mode,data)=>updateTreeData(val, mode, this)}/>
        </div>*/

      /* Create/Update Project Section */
      /*if(this.state.inListDetails) {
        if( !this.state.isProjectEmpty && !this.state.isNodeEditMode) {
          createProjectOption = <div>
            
              <button className="btn btn-default pull-right" onClick={this.updateSketchDetails}> Update Sketch </button>
            </div>
        } else {
          createProjectOption = <div>
      
              <button className="btn btn-default pull-right disabled"> Update Sketch </button>
            </div>
        }
      } else {
        if( !this.state.isProjectEmpty && !this.state.isNodeEditMode) {
          createProjectOption = <button className="btn btn-default pull-right" onClick={this.submitSketchDetails}> Create Project </button> 
        } else {
          createProjectOption = <button className="btn btn-default pull-right disabled" > Create Project </button> 
        }
      }*/

      /* saveSketch = <div className="col-md-12 col-sm-12 text-right save-sketch-section">
         {createProjectOption}
       </div>   */
      //console.log("In crud sketch");
      //console.log(this.state.treedata);

      loadedComponent =
        <div className={"row " + (this.state.projectDetails["access"] == "READ" ? 'sketchProjectDisabled' : '')}>
          <div className="sketches-tree">
            {saveSketch}
            <CRUDTree
              data={
                [
                  this.state.treedata,
                  this.onClick,
                  {
                    x: this.state.offsetX,
                    y: this.state.offsetY
                  }
                ]}
              width={400} height={500}
              options={{
                border: "2px solid black",
                margin: {
                  top: 0,
                  bottom: 0,
                  left: 50,
                  right: 0
                }
              }
              } />
          </div>
          <div>
            {this.props.children}
          </div>
        </div>
    } else {
      loadedComponent = <div className="text-center loading-project-details">Loading...</div>
    }


    return (<div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="sketch-list-wrapper">
        {loadedComponent}
      </div>
    </div>)
  }
}