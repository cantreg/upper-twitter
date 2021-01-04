import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Login from './Login'
import App from './App'

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path="/" component={Login}/>
            <Route path="/home-timeline" component={App}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'))

registerServiceWorker();
