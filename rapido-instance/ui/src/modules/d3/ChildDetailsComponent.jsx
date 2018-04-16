import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import Select from 'react-select'
import AutoSuggest from '../vocabulary/VocabularySuggest.jsx'
import AceEditor from 'react-ace'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import 'brace/mode/json'
import 'brace/theme/github'
import {updateAPIChange, updateCheckedStatus, updateAPISelection} from '../utils/ChildNodeActions';
import Button from 'mineral-ui/Button';
import TextInput from 'mineral-ui/TextInput';
import TextArea from 'mineral-ui/TextArea';
import  Popover from 'mineral-ui/Popover'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      childData: {
        apiList: [],
        url: '/'
      },
      apiStatus: "GET",
      checkedStatus: true,
      options : [
        { apiType: 'GET', label: 'GET' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'POST', label: 'POST', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PUT', label: 'PUT' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PATCH', label: 'PATCH', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'DELETE', label: 'DELETE', id:'', completed: false, request: '', response: '', summary: '' }
      ],
      apiData: this.props.apiData,
      paramValue: '',
      requestValue: '',
      responseValue: '',
      summaryInfo: '',
      titleInfo: '',
      currentNodeId: this.props.childInfo.pId,
      defaultValue: JSON.stringify({"200/500":{}}, null, 2)
    };
    this.alertOptions = AlertOptions;
    this.selectAPI = this.selectAPI.bind(this);
  }

  /* Component Mount after render */
  componentDidMount() {
   /* let scrollViewRef = ReactDOM.findDOMNode(this.refs.childNode)
    scrollViewRef.scrollIntoView();*/
  }

  /* Component Initialisation */
  componentWillMount() {  
    
    
    this.props.childInfo.apiList.map(function (type, i) {
      this.state.options.map(function (oType, j) {
        if(type.apiType === oType.apiType) {
          oType.completed = true;
          oType.id = type.apiId;
          oType.request = this.state.apiData[oType.id][oType.apiType].request;
          oType.response = this.state.apiData[oType.id][oType.apiType].responses;
          oType.summary = this.state.apiData[oType.id][oType.apiType].summary;
          oType.title = this.state.apiData[oType.id][oType.apiType].title;
        }
      }, this)    
    }, this)

    this.setState({
      childData: this.props.childInfo,
      childUpdatedData: this.props.childInfo
    });
    if(this.props.childInfo.apiList.length > 0)
    this.setState({
      apiStatus:this.props.childInfo.apiList[0].apiType
    })
  }

  componentWillReceiveProps(nextProps){
    
    this.props = nextProps;
    this.props.childInfo.apiList.map(function (type, i) {
      this.state.options.map(function (oType, j) {
        if(type.apiType === oType.apiType) {
          oType.completed = true;
          oType.id = type.apiId;
          oType.request = this.state.apiData[oType.id][oType.apiType].request;
          oType.response = this.state.apiData[oType.id][oType.apiType].responses;
          oType.summary = this.state.apiData[oType.id][oType.apiType].summary;
          oType.title = this.state.apiData[oType.id][oType.apiType].title;
        }
      }, this)    
    }, this)
    this.setState({
      childData: this.props.childInfo,
      childUpdatedData: this.props.childInfo,
      currentNodeId: this.props.childInfo.pId,
    });
    if(this.props.childInfo.apiList.length > 0){
      this.setState({
        apiStatus:this.props.childInfo.apiList[0].apiType
      })
    } 
  else{
    this.setState({
      options : [
        { apiType: 'GET', label: 'GET' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'POST', label: 'POST', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PUT', label: 'PUT' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PATCH', label: 'PATCH', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'DELETE', label: 'DELETE', id:'', completed: false, request: '', response: '', summary: '' }
      ],
    })
  }
  }
  /* Method to associate node details */
  associateNode(validity) {
    this.props.setChildEditDetails(this.state.childData, validity);
  }

  getAlert() {
    updateCheckedStatus( { apiType: this.state.apiStatus, label: this.state.apiStatus , id:this.props.childInfo.pId, completed: false, request: this.state.requestValue, response:  this.state.responseValue, summary: this.state.summaryInfo ,active:true},this);
 }
  /* Method to select API from dropdown */
  selectAPI(val) {
    updateAPISelection(val, this, event, showAlert)
   
  }

  /* Method to check/uncheck node association */
  bindAPI(val) {
    updateCheckedStatus(val, this)
  }

  /* Method to check tree data validation */
  validityCheckStatus() {
    if(this.state.childUpdatedData.apiList && this.state.childUpdatedData.url) {
      return true;
    } else {
      return false;
    }
  }

  /* Method to handle URL changes */
  handleURLChange(value, field) {
    this.setState({
      childData: {
        url: value,
        apiList: this.state.childData.apiList
      }
    });
    this.state.childUpdatedData.url = value;
    this.state.childUpdatedData.apiList = this.state.childData.apiList;
    let validity = this.validityCheckStatus()
    this.props.setChildEditDetails(this.state.childUpdatedData, !validity)
  }

  /* Method to update API changes */
  handleAPIChange (field, data) {
    updateAPIChange(field, data, this)
  }

  /* Method to check JSON format */
  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  /* Render Method */
  render() {
   
    let checkBoxSection, apiPayloadSection, requestLabel;
   // console.log(this.state.options);
   // console.log(this.state.childData.url)
     this.state.options.map(function (todo, i) {
     // console.log(this.state.apiStatus) 
      if(todo.label === this.state.apiStatus) {
      // console.log(this.state.summaryInfo)
        //if(todo.completed) {
          /*if(!this.state.requestValue && todo.request) {
            this.state.requestValue = todo.request;
          }
          if(typeof (this.state.requestValue) === "object") {
            this.state.requestValue = JSON.stringify(this.state.requestValue, null, 2)
          }
          if(!this.state.responseValue && todo.response) {
            this.state.responseValue = todo.response;
          }
          if(typeof (this.state.responseValue) === "object") {
            this.state.responseValue = JSON.stringify(this.state.responseValue, null, 2)
          }
          if(!this.state.summaryInfo && todo.summary) {
            this.state.summaryInfo = todo.summary;
          }
          if(!this.state.titleInfo && todo.title) {
            this.state.titleInfo = todo.title;
          }*/

          this.state.requestValue = todo.request;
          if(typeof (this.state.requestValue) === "object") {
            this.state.requestValue = JSON.stringify(this.state.requestValue, null, 2)
          }

          this.state.responseValue = todo.response;
          if(typeof (this.state.responseValue) === "object") {
            this.state.responseValue = JSON.stringify(this.state.responseValue, null, 2)
          }
          this.state.summaryInfo = todo.summary;
          this.state.titleInfo = todo.title;


          if(todo.id) {
            this.state.currentNodeId = todo.id;
          }else{
            todo.id = this.state.currentNodeId;
          }
          if(this.state.apiStatus === 'GET') {
            requestLabel = <label className="Request-Params">Request Params</label>
          } else {
            requestLabel = <label className="Request-Params">Request : Application/JSON</label>
          }
          apiPayloadSection = <div>
          <div className="form-group">
                        <label className="summary">Summary</label>
                        <TextArea
                            size="small"
                            className="Rectangle-5-Copy-7" 
                            value={this.state.summaryInfo} onChange={(evt) => this.handleAPIChange("summary",evt)}/>                       
                    </div>
                    <div className="form-group">
            {requestLabel}
            <div className="ace-editor-box">
              <AceEditor
                mode="json"
                theme="github"
                height="200px"
                width="100%"
                value={this.state.requestValue}
                onChange={(evt) => this.handleAPIChange("request",evt)}
                name="other-request"
                editorProps={{$blockScrolling: true}}
                setOptions={{
                  tabSize: 2,
                  fontSize: 14,
                  showGutter: true,
                  showPrintMargin: true,
                  maxLines: 30
                }}
              />
            </div>
            </div>
            <div className="form-group">
                        <label className="Response-Applicati">Response: Application/JSON</label>
                        <div  className="ace-editor-box">
                        <AceEditor
                  mode="json"
                  theme="github"
                  height="200px"
                  width="100%"
                  value={this.state.responseValue}
                  onChange={(evt) => this.handleAPIChange("response",evt)}
                  name="other-response"
                  editorProps={{$blockScrolling: true}}
                  setOptions={{
                    tabSize: 2,
                    fontSize: 14,
                    showGutter: true,
                    showPrintMargin: true,
                    maxLines: 30
                  }}
                />
                        </div>                    
                    </div>
             
          </div>
        //}
      }
      
    }, this)
   
    return(
      <div>
           <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
 <div className="form-group">
                        <label className="url">URL</label>
                        <Popover
                            content="Enter URL"
                            placement="right">
                            <i className="fa fa-question-circle vocabulary-icon"></i>
                        </Popover>
                        <div className="url-text-wrapper">
                            <div className="url-text">
     
            <AutoSuggest key={this.state.currentNodeId} queryInput={this.state.childData.url} updateSuggestedDetails={(val, mode)=>this.handleURLChange(val, 'url')}/>
          
    </div>
                            <div className="bitmap-img"><img src="/ui/src/images/bitmap.png" /> </div>
                        </div>                 
                    </div>
                    <div className="form-group">
                        <label className="Request-Type">Request Type</label>
                        <Select
                name="form-field-name"
                ref='childNode'
                value={this.state.apiStatus}
                valueKey='apiType'
                options={this.state.options}
                onChange={(e) => this.selectAPI(e)}
              />                      
                    </div>
                          {apiPayloadSection}

        </div>

    )
    
  }
}
