import React from 'react'
import ReactDOM from 'react-dom'
import NavItem from './NavigationItem'
export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      pathName: ''
    };
  }

  /* Render Method */
  render() {
    let path = this.props.pathInfo;
    let description;
    
    switch (path) {
      case '/nodes/edit':
        description = <NavItem subPath="Sketch" />
        break;

      case '/vocabulary':
        description = <NavItem subPath="Vocabulary" />
        break;

      case '/export':
        description = <NavItem subPath="Export" />
        break;

      case '/nodes/add':
        description = <NavItem subPath="Details" />
        break;

      default: 
        description='' 
    }
    return(
      <div className="col-md-12 nav-description">
        {description}
      </div>
    )
  }
}
