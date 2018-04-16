import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions';
import Dropdown from 'mineral-ui/Dropdown';
import Button from 'mineral-ui/Button';
import { ThemeProvider } from 'mineral-ui/themes';
import Select from 'react-select';
import TextInput from 'mineral-ui/TextInput';
import Icon from 'mineral-ui/Icon';
import { IconSearch } from 'mineral-ui-icons';
import SketchService from './SketchServices'

export class SketchesSortComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filteredData: this.props.sketches,
      sketches: this.props.sketches,
      isOpen: false,
      sortType: '',
      query: ''
    };

    this.alertOptions = AlertOptions;
  }
  openCloseSearch() {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen
    })
  }
  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId', 'null');
    sessionStorage.setItem('sketchName', 'null');
    sessionStorage.setItem('updateMode', false)
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  showFilterOptions(e) {
    e.preventDefault();
    this.setState({ showFilter: !this.state.showFilter })
  }

  handleViewBy(event) {
    var value = event.target.value;
    if (value != "All") {
      document.getElementsByClassName("Shared_div")[0].style.display = "none";
      document.getElementsByClassName("Personal_div")[0].style.display = "none";
      document.getElementsByClassName("Shared_div")[1].style.display = "none";
      document.getElementsByClassName("Personal_div")[1].style.display = "none";
      var divName = value + "_div";
      document.getElementsByClassName(divName)[0].style.display = "block"
      document.getElementsByClassName(divName)[1].style.display = "block"
    }else{
      document.getElementsByClassName("Shared_div")[0].style.display = "block";
      document.getElementsByClassName("Personal_div")[0].style.display = "block";
      document.getElementsByClassName("Shared_div")[1].style.display = "block";
      document.getElementsByClassName("Personal_div")[1].style.display = "block";
    }

  }
   
  render() {
    const icon = <IconSearch />;
    const filterOptions = <span>
      <label className="view-text">Filter&nbsp;&nbsp;:&nbsp;&nbsp;</label>
      <select
        name="form-field-name"
        className="custom-select">
        <option className="custom-select-option">Apps Team</option>
        <option className="custom-select-option">Dev Team</option>
        <option className="custom-select-option">API Experts</option>
      </select>
      <span className="anchor-tag"><a>&nbsp;&nbsp;Clear</a></span>
    </span>
    return (
      <div className="col-md-12">

        <div className="col-md-5 pull-left xs-pl-8">
          <ul className="button-inline">
            <li onClick={this.addNewSketch.bind(this)}><Button className="new-sketch-text" variant="regular" primary>New Sketch</Button></li>
            <li className="xs-pl-10"><TextInput iconEnd={icon} type="text" className=" visible search-textbox" onChange={this.props.onChange} size="small"
              placeholder="Search" /></li>
          </ul>
        </div>
        <div className="col-md-6 pull-right xs-pr-5">
          <label className="view-text">View&nbsp;&nbsp;:&nbsp;&nbsp;</label>
          <select
            name="form-field-name"
            className="custom-select" onChange={this.handleViewBy.bind(this)}>
            <option className="custom-select-option">All</option>
            <option className="custom-select-option">Personal</option>
            <option className="custom-select-option">Shared</option>
          </select>
          <span className="xs-pl-10">
            <span><i className="filter-icon" onClick={this.showFilterOptions.bind(this)}><img src="/ui/src/images/filter.png" /></i></span>
            {this.state.showFilter && filterOptions}
          </span>
          <span className="xs-pl-10 xs-pr-15 sort pull-right">
            <label className="view-text">Sort By&nbsp;:&nbsp;</label>
            <span className="xs-pl-5"><Button className="inactiveButton" size="small" disabled>Created</Button></span>
            <span className="xs-pl-5"><Button id="sortByUpdatedBtn" size="small" className={(this.props.sortType == 'updated') ? "activeButton" : "inactiveButton"} onClick={this.props.sortSketch}>Updated</Button></span>
            <span className="xs-pl-5"><Button id="sortByNameBtn" size="small" className={(this.props.sortType == 'name') ? "activeButton" : "inactiveButton"} onClick={this.props.sortSketch}>Name</Button></span>
          </span>
        </div>

      </div>

    )
  }

}