import React from 'react'
import { Link } from 'react-router'
import RegistrationForm from '../register/RegistrationForm'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  /* Render Method */
  render() {
    return(
      // <div className="home-page-main-section">
      //   <div className="home-page-section-one">
      //     <span className="home-page-section-one-span">
      //       CA Live API Design is a tool that facilitates the sketching phase of API design
      //       <Link to="/register" className="register-button">
      //         <button className="btn btn-default">Start Trial Today</button>
      //       </Link>
      //     </span>
      //   </div>
      //   <div className="home-page-section-two">
      //     <div className="container">
      //       <div className="row">
      //         <div className="col-md-12">
      //           <ul className="feature-list">
      //             <li className="feature-list-item">
      //               <div className="feature-list-item-image">
      //                 <img src="data:image/png;base64,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" alt="Create" />
      //               </div>
      //               <div className="feature-list-item-text">
      //                 <h2>Easy To Create</h2>
      //                 <div className="feature-list-item-text-section">
      //                   <p>User should be able to create a complete API sketch within five minutes.</p>
      //                 </div>
      //               </div>
      //             </li>
      //             <li className="feature-list-item">
      //               <div className="feature-list-item-text">
      //                 <h2>Easy To Dispose</h2>
      //                 <div className="feature-list-item-text-section">
      //                   <p>Users should feel safe when starting a design over.</p>
      //                 </div>
      //               </div>
      //               <div className="feature-list-item-image">
      //                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACrklEQVR42u3dzW3CMBgG4EzWZTpKK7EIG5V2gyxQKfTAoRWohx5ANImJ/fl7kHxFid8HJ/5lGH4/r+/Tt1KnDLU/QkiMQOU3U3YAJC4vh+kTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADorpxCAohyvQHqMh6AKMvYgtQnAAAAAAAAOQGE7AVEWsreel0CkLzrCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARBgKBsBkkMkgAAAAwHoAAABI+BJY4EUQgMzdQAAAAMBAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAN3PBQCQfDYQAAAAAAAAAKK9UUe53g2ua5x1TYfpbWjh43y+BH8NC4DQARA8ALWDX/jdIwCBg2++hRFi+TBCPWoEGSv44hAEGjf8IhCEuq6Sm5pS/pieAUga/uLWIFO/N0P4s3NJNeix4J4jt5oArLznHh6ZABQE0OVgFQB9h383q2yTHxnDfyiADF2+rgexBJ4j/JsIhA6A4JOEf/U+BQ+A8K9UTJp7FXyuXz8A//r1H/cAaP5z3LPw8zX/AABQDkAPcwEAJJ8NzNotBuBBAELt7AagLIBIW/suZxIAUA5AxL2dBZq84z76YhAAdANTPgIACA5g/U6irycAdAMB+AvgvL8OAEPBAAAAgPcAAACwIMRjAAAAAOjlgIjRY6DgsvDedgfbF2B7ePetgPMBZgCwNzDpARFz3hvSbw93QITzAXQLnRDiYMiUh0RpBZIfEwdB8oMiIQgePgB9Ith0YWGWcllAGaD+Nl9ZqnfQTh1WWVoMQf26rLq2HIJ69dnE5gIIbtbrrungAdgukKa3nAuwzi/zzneNTc2OKR3PkArsoeUEgNJ2yyCYRkYaz8e1AJB5qHnBv35C4PEAgfBXfX4AzuQPw+qkNzQAAAAASUVORK5CYII=" alt="Transform" />
      //               </div>
      //             </li>
      //             <li className="feature-list-item">
      //               <div className="feature-list-item-image">
      //                 <img src="data:image/png;base64,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" alt="Translate" />
      //               </div>
      //               <div className="feature-list-item-text">
      //                 <h2>Easy To Translate</h2>
      //                 <div className="feature-list-item-text-section">
      //                   <p>User should be able to export sketches at later stages of API Lifecycle.</p>
      //                 </div>
      //               </div>
      //             </li>
      //           </ul>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      //   <div className="home-page-section-three">
      //     <div className="container">
      //       <div className="row">
      //         <div className="col-md-12">
      //           <p className="footer-text">CA Live API Design | © 2018 CA Technologies.</p>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <div>
        <div className="row ">
          <span><img className="header-image-main" src="/ui/src/images/group@3x.png"/></span>
        </div>
        <div>
          <div className="text-main-wrapper">
            <span className="text-main1">CA API Design</span>
            <span className="text-main2">is a tool that facilities the sketching phase of API Design</span>
          </div>
          <div>
            <img className="image-main" src="/ui/src/images/process.png"/>          
          </div>
        </div>
        <div className="github-main">
            <div className="github-container">
              <div className="Sign-up-fee-with-Git">
                <p className="signupgit-text">Sign up for github</p>
                <img className="signupgit-image" src="/ui/src/images/github.png"/> 
              </div>
              <div className="signup-wrapper">
                <span className="No-Github">No Github?</span>
                <span className="No-Github-Sign-up-f">Sign up free with email!</span>
              </div>
            </div>            
        </div>        
      </div>
    )
  }
}