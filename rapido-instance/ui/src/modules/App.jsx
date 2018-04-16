import React from 'react'
import AuthenticatedBody from './AuthenticatedBody'
import Header from './header/Header'
import Login from './login/LoginComponent'
import { browserHistory } from 'react-router'
import NavDetail from './header/NavigationDetailsComponent'
import { createTheme, ThemeProvider } from 'mineral-ui/themes';
import caApiDesignThemeObj from './theme/ca-api-design-theme';
import 'bootstrap/dist/css/bootstrap.css'
import 'react-select/dist/react-select.css'
import '../css/styles.scss'

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      designDetails: {
        enableExport: false,
        exportSelection: false,
        pathName: this.props.location.pathname
      }
    };
  }

  /* Render Method */
  render() {
    let header = <Header authenticated={false}/>
    let bodyContent, navDetails;
    let userObject = JSON.parse(sessionStorage.getItem('user'));
    if(userObject && userObject.id) {
      header = <Header authenticated={true} location={this.props.location} userInfo = {userObject} exportStatus={this.state.designDetails.enableExport} pathInfo= {this.state.designDetails.pathName}/>
    } else {
      header = <Header authenticated={false} location={this.props.location}/>
    }
    navDetails = <NavDetail pathInfo={this.props.location.pathname} />

    const caApiDesignTheme = createTheme('ca-api-design-theme', caApiDesignThemeObj);
    
    return (
      <ThemeProvider theme={caApiDesignTheme}>

      <div className ="container-fluid">
        {header}
        <div className="col-sm-12 main-content noscroll">
          {React.cloneElement(this.props.children, { designDetails: this.state.designDetails })}
        </div>
      </div>
      </ThemeProvider>
    )
  }
}

