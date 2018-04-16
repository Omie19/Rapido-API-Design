import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'
import TextInput from 'mineral-ui/TextInput';
import Button from 'mineral-ui/Button';

export class HeaderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isSearchOpen: false };
    this.alertOptions = AlertOptions;
  }
  
  render() {

    return (

      <div className="row sketch-header-padding">        
        <div className="col-md-12 border-bottom">
          <div className="col-md-2 sketches-text">
            Sketches
          </div>
        </div>
      </div>
    )
  }

}