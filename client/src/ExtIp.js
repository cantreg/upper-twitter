import React, {Component} from 'react';
import requestAgent from 'request';
import autobind from 'autobind-decorator'

@autobind
class ExtIp extends Component {

    constructor(props) {
        super(props);
        this.state = {
           ip: 'resolving...'
        };

    }

    render() {
        return (
            <div className="ExtIp">
                <span>Your ip is {this.state.ip}</span>
            </div>
        );
    }

    componentDidMount() {
        this.setRefreshIp();
        return;
    }

    getIp() {
        return new Promise((resolve, reject) => {
            requestAgent({
                method: 'GET',
                url: 'https://api.ipify.org?format=json',
                json: true,
            }, (error, response, body) => {
                if(!error) resolve(body.ip);
                return reject(error);
            })
        })
    }

    updateIp() {
        return this.getIp().then(
            (ip) => this.setState({ip: ip}),
            (error) => this.setState({ip: this.state.ip + " (obsolete)" })
        )
    }

    setRefreshIp() {
        this.updateIp().then(
            (r) => setTimeout(this.setRefreshIp, 30000),
            (e) => setTimeout(this.setRefreshIp, 30000)
        )
    }
}

export default ExtIp;
