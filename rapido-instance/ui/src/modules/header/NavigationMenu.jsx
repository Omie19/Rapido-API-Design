import React from 'react'
import { browserHistory } from 'react-router'

export default React.createClass({
    getDefaultProps ()
    {
      return {
        isOpen: false
      };
    },

    render()
    {
      if (this.props.isOpen === true)
      {
        return (
          <div className="dropdown">
            <ul className="user-options">
              <li><a id="option-logout">Logout</a></li>
            </ul>
          </div>
          
        );
      }
      return null;
    }
});