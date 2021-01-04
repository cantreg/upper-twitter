import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import rp from 'request-promise';
import Tweet from './Tweet';
import autobind from 'autobind-decorator';
import ExtIp from "./ExtIp";

@autobind
class TwitterFetcher extends Component {

    tweetComponentMap = [];

    constructor(props) {
        super(props);
        this.state = {
            minRetweet: 5,
            minFavorite: 10,
            tweets: [],
            tweetTagList: []
        };
    }

    render() {
        let tweetTagList = this.state.tweetTagList;
        if(tweetTagList.length > 0) {
            return (
                <div key="TwitterFetcher" className="TwitterFetcher bg-dark box-shadow mx-auto">
                    <table>
                        <tbody>
                            <tr><td><button onClick={(e) => this.loadContent('newer')}>newer</button></td></tr>
                            {this.state.tweetTagList}
                            <tr><td><button onClick={(e) => this.loadContent('older')}>older</button></td></tr>
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="TwitterFetcher bg-dark box-shadow mx-auto">
                    <button onClick={this.loadContent}>try load again</button>
                </div>
            );
        }
    }

    componentDidMount() {
        ExtIp.prototype.getIp().then((ip) => {
            this.setState({
                ip: ip,
            });
            this.loadContent();
        });
    }

    componentDidUpdate() {
        let j = 0;
        this.state.tweetTagList.forEach((tweetTag) => {
            let tweetComponent = this.tweetComponentMap[tweetTag.key];
            let tweet = tweetComponent.state.tweet;
            let isVisible = (tweet) => tweet.retweet_count > this.state.minRetweet || tweet.favorite_count >  this.state.minFavorite;
            let visible = isVisible(tweet);
            if(tweetComponent.state.visible != visible) {
                tweetComponent.setState({visible: visible, animationAppearDelay: j*250});
                j++;
            }
        });
        // this.tweetComponentList.forEach((tweetComponent) => {
        //     tweetComponent.playAppearAnimation()
        // });
        //this.playAnimation();
    }

    loadContent(strategy) {
        this.getUserTweetsWithAppToken(strategy).then((tweets) => {
            let tweetTagList = this.getTags(tweets);
            switch (strategy) {
                case 'newer':
                    this.setState({
                        tweets: tweets.concat(this.state.tweets),
                        tweetTagList: tweetTagList.concat(this.state.tweetTagList)
                    });
                    break;
                case 'older':
                    this.setState({
                        tweets: this.state.tweets.concat(tweets),
                        tweetTagList: this.state.tweetTagList.concat(tweetTagList)
                    });
                    break;
                default:
                    this.setState({
                        tweets: tweets,
                        tweetTagList: tweetTagList
                    });
                    break;
            }
        }).catch((e) => alert(e));
    }

    getTags(tweets) {
        let tweetTagList = [];
        for(let i = 0; i < tweets.length; i++) {
            let tweet = tweets[i];
            let tweetTag = <Tweet ref={(tweetComponent) => {
                this.tweetComponentMap[tweetComponent.props.tweet.id_str] = tweetComponent
            }} key={tweet.id_str} tweet={tweet} visible={false}/>
            tweetTagList.push(tweetTag);
        }
        return tweetTagList;
    }

    getTweets(strategy) {
        var options = {
            url: 'http://'+this.state.ip+':5000/api/home_timeline'
        };
        let tweets = this.state.tweets;
        switch (strategy) {
            case 'newer':
                if(!tweets) return;
                var afterId = tweets[0].id_str;
                options.url += "?afterId="+afterId;
                break;
            case 'older':
                if(!tweets) return;
                var beforeId = tweets[tweets.length - 1].id_str;
                options.url += "?beforeId="+beforeId;
                break;
            default:
                break;
        }
        return rp(options).then((result) => {
            return JSON.parse(result);
        });
    }

}

export default TwitterFetcher;