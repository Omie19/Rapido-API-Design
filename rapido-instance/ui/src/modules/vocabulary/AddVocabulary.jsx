import React from 'react'
import Autosuggest from 'react-autosuggest';
import  Popover from 'mineral-ui/Popover'
import { browserHistory, Link } from 'react-router';
import TextInput from 'mineral-ui/TextInput';
import { cloneDeep, findIndex, orderBy } from 'lodash';
import ProjectDetails from '../d3/ProjectDetailsComponent'
import ProjectService from '../d3/ProjectServices'
import { loadProjectDetails } from '../utils/TreeActions';
import {showAlert, AlertOptions} from '../utils/AlertActions'
import AlertContainer from 'react-alert'


export default class extends React.Component{
  
  constructor(props) {
    super(props);    
    this.state = {
      vocabularySearch:[],
      selectedSketch: this.props.selectedSketch,
      vocabularyData: [],
      
    }
  
  
    this.addVocabulary = this.addVocabulary.bind(this);
  }
  componentDidMount(){

    this.setState({
      selectedSketch: this.props.selectedSketch,  
    })
    
    let prjSrvGetPrjDetRes = null;
    ProjectService.getProjectDetails(sessionStorage.getItem('sketchId'))
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDetRes.ok) {
        let tempVocabData = [];
        responseData.vocabulary.map(function (vocab) {
          if(typeof vocab === "string")
          tempVocabData.push({"name":vocab});
          else
          tempVocabData.push({"name":vocab.name});
        }, this);
        this.setState({
          vocabularyData: tempVocabData,
          
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
  
    this.setState({
      vocabularySearch:this.state.vocabularyData      
    })
  }
  
 /* Method to add vocabulary */
 addVocabulary (e) {
  e.preventDefault();
  let prjSrvAddVocabRes = null;
  let vocabArray = [];
  let newVocabulary = document.getElementById("addVocabulayText").value;
   vocabArray.push(newVocabulary);
  ProjectService.addVocabularyToProject(vocabArray, this.state.selectedSketch["projectid"])
  .then((response) => {
    prjSrvAddVocabRes = response.clone();
    return response.json();
  })
  .then((responseData) => {
    if(prjSrvAddVocabRes.ok) {
      let tempVocabArr = this.state.vocabularyData;
      document.getElementById("addVocabulayText").value = "";
      tempVocabArr.push({"name":newVocabulary});
      this.setState({
        query: {},
        vocabularyData: tempVocabArr
      });
      sessionStorage.setItem('vocabularyInfo',JSON.stringify(this.state.vocabularyData))
    } else {
      showAlert(this, (responseData.message) ? responseData.message : "Error occured");
      if(prjSrvAddVocabRes.status == 401) {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });
}



/* Method to remove vocabulary */
handleDelete(name){
  const vocabularyData = cloneDeep(this.state.vocabularyData);
  const idx = findIndex(vocabularyData, { name });
  let prjSrvDelVocabRes = null;
  ProjectService.deleteVocabularyFromProject(name, this.state.selectedSketch["projectid"])
  .then((response) => {
    prjSrvDelVocabRes = response.clone();
    return response.json();
  })
  .then((responseData) => {
    if(prjSrvDelVocabRes.ok) {
      vocabularyData.splice(idx, 1);
      this.setState({ vocabularyData });
      sessionStorage.setItem('vocabularyInfo',JSON.stringify(this.state.vocabularyData))
    } else {
      showAlert(this, (responseData.message) ? responseData.message : "Error occured");
      if(prjSrvDelVocabRes.status == 401) {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
  /* Render method */
  render() { 
    let vocabularyList = null 
    if(this.state.vocabularyData){
      let vocabularyData = this.state.vocabularyData;
      vocabularyList = vocabularyData.map((row,i) => {
        if(row.name != ""){
 let list  = <div className=""><div className="vocabulary-text-div">&nbsp;&nbsp;-&nbsp;&nbsp;{row.name}</div><span className="vocabulary-hidden" ><i className="fa fa-times" onClick={this.handleDelete.bind(this,row.name)}></i></span></div>
       return( <li key={row.name}>{list}</li>);
        }
       
      })
    }
    return (
        <div className="vocabulary-panel">
         <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="view-text vocabulary-text"><img src="/ui/src/images/bitmap.png" />&nbsp;&nbsp;VOCABULARY&nbsp;&nbsp;
        <Popover
            content="This is vocabulary tab"
            placement="right"
            >
        
        <i className="fa fa-question-circle vocabulary-icon"></i></Popover>
            

       

        </div>
        
        <div className="xs-pt-10 xs-pl-28">
        <div className="vocabulary-text-div"><TextInput size="medium" placeholder="Add New" id="addVocabulayText" className="vocabulary-textbox" /></div>
        <span><i onClick={(e) => this.addVocabulary(e)}><img className="vocabulary-plus-icon" src="/ui/src/images/plus@2x.png" alt="add vocab" /></i></span>
        </div>
        
        <div className="row">
       <div  className="col-md-12">
        <ul  className="vocabulary-list">
       {vocabularyList}
          </ul>
       </div>
        </div>

          </div>
    );
  }
}
