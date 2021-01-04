import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ExtIp from "./ExtIp";
import autobind from 'autobind-decorator';

@autobind
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        ExtIp.prototype.getIp().then((ip) => {
            this.setState({
                ip: ip,
            });
        });
    }

    render() {
        let text;
        let href;
        if(this.state.ip) {
            href = 'http://'+this.state.ip+':5000/api/login';
            text = "login with twitter";
        } else {
            href = '#';
            text = "getting ready...";
        }
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Upper Twitter</h1>
                </header>

                <ExtIp/>

                <a id="loginButton" className="button" href={href}>{text}</a>

            </div>
        );
    }

}

export default Login;
