import React from 'react'
import ReactDOM from 'react-dom'

export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  /* Render Method */
  render() {
    let mainPath;
    let sketchName = sessionStorage.getItem('sketchName');
    if(sketchName !== 'null') {
      mainPath = sketchName
    } else {
      mainPath = "New Project"
    }
    return(
      <div className="col-md-12">
        <span className="options">{mainPath}</span>
        <span className="options-divider fa fa-angle-right"></span>
        <span className="options">{this.props.subPath}</span>
      </div>
    )
  }
}
