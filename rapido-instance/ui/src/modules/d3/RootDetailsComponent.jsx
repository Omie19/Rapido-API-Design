import React from 'react'
import { browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import AutoSuggest from '../vocabulary/VocabularySuggest.jsx';
import Button from 'mineral-ui/Button';
import TextInput from 'mineral-ui/TextInput';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rootData: {
        name: '',
        rootPath: ''
      }
    };
  }

  /* Component Initialisation */
  componentWillMount() {
    this.setState({
      rootData: this.props.rootInfo,
      rootUpdatedData: this.props.rootInfo
    })
  }

  /* Component Mount after render */
  componentDidMount() {
   /* let scrollViewRef = ReactDOM.findDOMNode(this.refs.rootNode)
    scrollViewRef.scrollIntoView();*/
  }

  /* Method to handle Form Input change */
  handleChange(info, field) {
    if (info === 'name') {
      this.setState({
        rootData: {
          name: field.target.value,
          rootPath: this.state.rootData.rootPath
        }
      });
      this.state.rootUpdatedData.name = field.target.value;
    } else if (info === 'rootPath') {
      this.setState({
        rootData: {
          name: this.state.rootData.name,
          rootPath: field.target.value
        }

      });
      this.state.rootUpdatedData.rootPath = field.target.value;
    }

    this.props.setEditDetails(this.state.rootUpdatedData)
  }

  /* Render Method */
  render() {
    var name = "";
    var path = ""
    if(this.state.rootData){
  name=this.state.rootData.name;
  path = this.state.rootData.rootPath
    }
    return (

    <div>
      
      <div className="form-group">
        <label className="ROOT-NAME">ROOT NAME</label>
        <TextInput className="Rectangle-5-copy-4"
          placeholder="ROOT"
          required
          value={name}
          onChange={(e) => this.handleChange('name', e)}
        />
      </div>
      <div className="form-group">
        <label className="ROOT-PATH">ROOT PATH</label>
        <TextInput className="Rectangle-5-copy-4"
          placeholder="/ROOT"
          value={path}
          onChange={(e) => this.handleChange('rootPath',e)}
          required
        />
      </div>
     </div>
      
        /* <div className="col-md-12 parent-node-edit-section" id="rootNodeSelection">
        <form className="col-md-6" ref='rootNode'>
          <div className="col-md-9">
            <div className="form-group">
              <label htmlFor="InputRootName" id="nameLabel">Root Name</label>
              <input
                type="text"
                value={this.state.rootData.name}
                className="form-control"
                id="InputRootName"
                name="name"
                ref="name"
                onChange={(e) => this.handleChange('name', e)}
                placeholder="Root Name" />
            </div>
            <div className="form-group">
              <label htmlFor="InputRootPath" id="rootPathLabel">Root Path</label>
              <AutoSuggest queryInput={this.state.rootData.rootPath} updateSuggestedDetails={(val, mode)=>this.handleChange(val, 'rootPath')}/>
            </div>
          </div>
          
        </form>
        
      </div>*/

        )
      }
    }
