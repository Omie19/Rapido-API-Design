import React from 'react'
import { browserHistory } from 'react-router'
import RootDetails from './RootDetailsComponent'
import ChildDetails from './ChildDetailsComponent';
import Button from 'mineral-ui/Button';
import TextInput from 'mineral-ui/TextInput';
import {showDetails, addNode, deleteNode, updateTreeData, updateProjectHeaders, addEmptySketch, loadProjectDetails, createSketch, updateSketch, updatePath, exportDesign, importDesign } from '../utils/TreeActions';
import ProjectService from './ProjectServices'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'

export default class extends React.Component {

  constructor(props) {
    super(props);
   
  }
  
 
  componentDidMount() {
 
    /*document.getElementById("nodeContainer").addEventListener("mousedown", function(e) {dragstart(e);});
    document.getElementById("nodeContainer").addEventListener("touchstart", function(e) {dragstart(e);});
    window.addEventListener("mousemove", function(e) {dragmove(e);});
    window.addEventListener("touchmove", function(e) {dragmove(e);});
    window.addEventListener("mouseup", dragend);
    window.addEventListener("touchend", dragend);*/
  
    var dragging = false;
    $(".cursor-drag").mousedown(function(e){
      e.preventDefault();
       
      dragging = true;
       $(document).mousemove(function(e){
         var percentage = (e.pageX / window.innerWidth) * 82;
         var mainPercentage = 82-percentage;
         document.getElementById("sidebar").style.width = percentage + "%";
         document.getElementById("nodeContainer").style.width = mainPercentage + "%"; 
      
      });
    });
    $(document).mouseup(function(e){
      if (dragging) 
      {  
          $(document).unbind('mousemove');
          dragging = false;
      
      }
   });
  }
  /* Method to Update Root data */
  updateRootData(rootData) {
    if (rootData.rootPath && rootData.name) {
      updateTreeData({
        rootNodeData: rootData
      }, false, this.props.component)
    } else {
      updateTreeData({
        rootNodeData: rootData
      }, true, this.props.component)
    }
  }

  /* Method to Update Child data */
  updateChildData(childData, jsonStatus) {
    if (childData.url && childData.apiList.length > 0 && !jsonStatus) {
      updateTreeData({
        childNodeData: childData
      }, false, this.props.component)
    } else {
      updateTreeData({
        childNodeData: childData
      }, true, this.props.component)
    }

  }
  /* Method to Update Sketch Details */
  updateSketchDetails() {
    if(this.refs.child){
      this.refs.child.getAlert();
    }
    
    this.props.component.setActiveStatus(this.props.component.state.treedata);
    let savedVocabulary;
    let userDetails = JSON.parse(sessionStorage.getItem('userInfo'));
    let VocabularyStored = sessionStorage.getItem('vocabularyInfo')
    if (VocabularyStored) {
      savedVocabulary = JSON.parse(VocabularyStored);
    } else {
      savedVocabulary = []
    }

    updateSketch(this.props.component, savedVocabulary, ProjectService, browserHistory)
  }

  /* Render Method */
  render() {
    var list = null;    
    if (this.props.nodeData) {
      if (this.props.nodeData.rootNodeData && this.props.nodeData.rootNodeData.active) {
        list = <RootDetails rootInfo={this.props.nodeData.rootNodeData} setEditDetails={(val) => this.updateRootData(val)} />
      } else if (this.props.nodeData.childNodeData && this.props.nodeData.childNodeData.name) {
        list = <ChildDetails ref="child" apiData={this.props.nodeData.apiExportData} childInfo={this.props.nodeData.childNodeData} setChildEditDetails={(val, status) => this.updateChildData(val, status)} />
      }/*else{
        alert("cmg")
        list = <RootDetails  rootInfo={this.props.nodeData.rootNodeData} setEditDetails={(val)=>this.updateRootData(val)} />
      }*/
    }
    return (


      <div className="Rectangle-8-Copy" id="mainContainer">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="form-group">
          <label className="Node-Properties">Node Properties</label>
        </div>
        {list}
        {list == null ? "" : <div className="node-button"><Button className="UPDATE pull-right" variant="regular" primary onClick={this.updateSketchDetails.bind(this)}>UPDATE</Button>
          <Button className="Cancel pull-right">Cancel</Button></div>}
</div>
    

    )
  }
}
