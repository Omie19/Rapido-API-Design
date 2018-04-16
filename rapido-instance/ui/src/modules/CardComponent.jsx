import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from './utils/AlertActions'
import Card, { CardBlock, CardTitle, CardFooter } from 'mineral-ui/Card';
import Avatar from 'mineral-ui/Avatar';

export class CardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.alertOptions = AlertOptions;
  }


  render() {
    let avatar = null;
    let cardFooter = null;
    if (this.props.avatar) {
      avatar = (
        <Avatar size="small">
          <img src="/images/avatar.svg" alt="Alt text" />
        </Avatar>
      )
    }
    if (this.props.footer) {
      cardFooter = <CardFooter title={this.props.footer} />
    }

    return (
      <div>

        <Card className="card-block">
          <CardTitle className="card-title" avatar={avatar} secondaryText={this.props.secondaryText} subtitle={this.props.subtitle}>{this.props.title}</CardTitle>
          <CardBlock>{this.props.block}</CardBlock>
          {cardFooter}
        </Card>
      </div>

    )
  }

}