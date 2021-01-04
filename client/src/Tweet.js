import React, {Component} from 'react';
import autobind from 'autobind-decorator';

@autobind
class Tweet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props,
            animationAppearDelay: 0
        }
    }

    render() {
        let id = "tweet-"+this.state.tweet.id_str;
        return (
            <tr><td><div id={id} className="tweet">
                <span>{this.state.tweet.text}</span><br/>
                <span>rt:{this.state.tweet.retweet_count} fav:{this.state.tweet.favorite_count}</span>
            </div></td></tr>
        )
    }

    componentDidMount() {
        if (this.state.visible) {
            this.playAppearAnimation();
        }
    }

    componentDidUpdate() {
        if (this.state.visible) {
            this.playAppearAnimation();
        } else {
            this.playDisappearAnimation();
        }
    }

    playAppearAnimation() {
        if(!this.isElementAppeared()) {
            this.updateTransitionDelay();
            let element = this.getElement();
            setTimeout(() => {
                element.classList.add("tweet-tr-appear")
            } , 100);
        }
    }

    playDisappearAnimation() {
        if(this.isElementAppeared()) {
            this.updateTransitionDelay();
            let element = this.getElement();
            setTimeout(() => {
                element.classList.remove("tweet-tr-appear")
            } , 100);
        }
    }

    updateTransitionDelay() {
        let delay = 0 + this.state.animationAppearDelay;
        this.getElement().style.transition = "margin 1500ms " + delay + "ms, opacity 1000ms " + delay + "ms";
    }

    isElementAppeared() {
        return this.getElement().classList.contains("tweet-tr-appear");
    }

    getElement() {
        return document.getElementById("tweet-" + this.state.tweet.id_str);
    }
}

export default Tweet;