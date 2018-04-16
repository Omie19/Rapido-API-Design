import React from 'react'

export function showAlert(component, message) {
  component.msg.state.alerts= [];
  component.msg.error(message, {
    time: 2000,
    type: 'error',
    icon: <span className=""></span>
  });
}

const AlertOptions = {
  offset: 14,
  position: 'top right',
  theme: 'dark',
  time: 2000,
  transition: 'scale'
};