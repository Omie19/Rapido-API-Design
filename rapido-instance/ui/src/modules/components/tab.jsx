import React from 'react'

export const Tab = (props) => {
    return (
        <li className={`tab ${props.isActive ? 'active-tab' : ''}`}
        onClick={(event) => {
            event.preventDefault();
            props.onClick(props.tabIndex);
        }}>
            <a className="tab-link">
                {props.label}
            </a>
        </li>
    )
}