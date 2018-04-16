import React from 'react'
import RegistrationForm from './RegistrationForm'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  /* Render Method */
  render() {
    return(
      <div>
        <RegistrationForm fromDashboard={false}/>
      </div>
    )
  }
}
