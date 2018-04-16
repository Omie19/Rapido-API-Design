import React from 'react'
import { render } from 'react-dom'
import App from './modules/App'
import CRUDSketch from './modules/CRUDSketch'
import AddSketch from './modules/d3/AddSketchComponent'
import VocabEditor from './modules/vocabulary/VocabularyEditor'
import Export from './modules/export/ExportComponent'
import Login from './modules/login/LoginComponent'
import Verification from './modules/login/VerificationComponent'
import Register from './modules/register/RegistrationComponent'
import Dashboard from './modules/login/DashboardComponent'
import ForgotPassword from './modules/register/ForgotPasswordComponent'
import ResetPassword from './modules/register/ResetPasswordComponent'
import MailVerification from './modules/register/MailVerificationComponent'
import Sketches from './modules/sketches/SketchesComponent'
import MainLayoutComponent from './modules/newsketches/MainLayoutComponent'
import Profile from './modules/profile'
import ShareProject from './modules/shareProject'
import Teams from './modules/team/teams'
import TeamDetails from './modules/team/teamDetails'
import AuthComponent from './modules/login/AuthComponent'
import RouteNotFoundComponent from './modules/404Component'
import { Router, Route, browserHistory,IndexRoute, Redirect } from 'react-router'
import NodeProperties from './modules/vocabulary/NodeProperties';

const checkSession = (nextState, replace) => {
  let userObject = JSON.parse(sessionStorage.getItem('user'));
  if(!userObject) {
    replace('/login');
  }
}

render(<Router history={browserHistory}>
  <Route path="/" component={App} >
    <IndexRoute component={Dashboard} onEnter={checkSession}/>
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/home" component={Dashboard} />
    <Route path="/resetPassword(/:resetPasswordToken)" component={ResetPassword} />
    <Route path="/forgotPassword" component={ForgotPassword} />
    <Route path="/auth" component={AuthComponent} />
    <Route path="/verify(/:pathParam1)" component={Verification} />
    <Route path="/mailVerification" component={MailVerification} />
    <Route path="/oldsketches" component={Sketches} onEnter={checkSession}/>
    <Route path="/sketches" component={MainLayoutComponent} onEnter={checkSession}/>
    <Route path="/profile" component={Profile} onEnter={checkSession}/>
    <Route path="/teams" component={Teams} onEnter={checkSession}/>
    <Route path="/nodes" onEnter={checkSession}>
      <Route path="/nodes/add" component={AddSketch}></Route>
      <Route path="/nodes/edit" component={CRUDSketch}></Route>
    </Route>
    <Route path="/team" component={TeamDetails} onEnter={checkSession}/>
    <Route path="/share" component={ShareProject} onEnter={checkSession}></Route>
    <Route path="/vocabulary" component={VocabEditor} onEnter={checkSession}></Route>
    <Route path="/Node" component={NodeProperties} onEnter={checkSession}></Route>
    <Route path="/export" component={Export} onEnter={checkSession}></Route>
    <Route path="/404" component={RouteNotFoundComponent}></Route>
  </Route>
  <Redirect from='*' to='/404' />
</Router>, document.getElementById('App'))
