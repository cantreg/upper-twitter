import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ExtIp from "./ExtIp";
import TwitterFetcher from "./TwitterFetcher";
import './WheelPick.css'
import WheelPick from './WheelPick.js'
import autobind from 'autobind-decorator';

@autobind
class App extends Component {

    twitterFetcherComponent;

    constructor(props) {
        super(props);
    }

    render() {

        var twitterFetcherTag = <TwitterFetcher ref={(tfc) => {this.twitterFetcherComponent = tfc}}/>
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Upper Twitter</h1>
                </header>

                <div style={{margin: "20px"}}>
                    <a className="App-intro">All tweets should be retweeted</a>
                    <div id="ticker">
                        <div className="retweet-rotator rotator"></div>
                        <div className="retweet-rotator rotator"></div>
                        <div className="retweet-rotator rotator"></div>
                        <div id="retweet-result" className="result"></div>
                    </div>
                    <a className="App-intro">times or favorited</a>
                    <div id="ticker">
                        <div className="fav-rotator rotator"></div>
                        <div className="fav-rotator rotator"></div>
                        <div className="fav-rotator rotator"></div>
                        <div id="fav-result" className="result"></div>
                    </div>
                    <a className="App-intro">times</a>
                </div>


                <ExtIp/>
                {twitterFetcherTag}
            </div>
        );
    }

    componentDidMount() {
        WheelPick(window, '.retweet-rotator', '#retweet-result', [0,0,5], (value) => {
            this.twitterFetcherComponent.setState({minRetweet: value});
        });
        WheelPick(window, '.fav-rotator', '#fav-result', [0,1,0], (value) => {
            this.twitterFetcherComponent.setState({minFavorite: value});
        });
    }


}

export default App;
