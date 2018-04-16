import React from 'react';
import { browserHistory } from 'react-router';

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      filteredData: this.props.sketches,
      query: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /* Method to handle search */
  handleChange(event) {
    var queryResult=[];
    this.props.sketches.forEach(function(sketch){
      if(sketch.name.toLowerCase().indexOf(event.target.value)!=-1)
      queryResult.push(sketch);
    });
    this.setState({
      query: event.target.value,
      filteredData: queryResult
    })
  }

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  /* Render Method */
  render() {

    const { filteredData } = this.state;

    const sketchItems = filteredData.map(function (row) {
      return (
        <div className="sketch-card" key={row.id}>
          <div className="header">
            <span className="name">{row.name}</span>
          </div>
          <div className="header">
            <div className="description">
              {row.description}
            </div>
            <span className="time">{row.createdAt}</span>
            <span className="time">{row.modifiedAt}</span>
          </div>
        </div>
      );
    }, this);

    return(
      <div className="col-md-12 sketch-list-wrapper">
        <div className="col-md-12 add-sketch-section">
          <input type="text" value={this.state.query} onChange={this.handleChange} />
          <button onClick={this.addNewSketch.bind(this)} className="btn btn-default new-sketch-label">+ Create New Project</button>
        </div>
        {sketchItems}
      </div>
    )
  }
}
