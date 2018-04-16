import React from 'react'
import { Link } from 'react-router'
export default class extends React.Component{
  
  /* Render Method */
  render() {
    return(
      <div className="route-not-found-page-container">
      	<h2>404: Not Found</h2>
      	<h3>The page you requested was not found.</h3>
      	<Link className="goback-btn" to="/home"><button className="btn btn-default pull-right">Go Back</button></Link>
      </div>
    )
  }
}
