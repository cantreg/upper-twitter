
var OAuth = require('oauth');
var rp = require('request-promise');
var util = require('util');

var requestTokenUrl = "https://api.twitter.com/oauth/request_token";
var accessTokenUl = "https://api.twitter.com/oauth/access_token";
var twitterConsumerKey = '# Add your API key here';
var twitterConsumerSecret = '# Add your API secret key here';

var oauth = new OAuth.OAuth(
    requestTokenUrl,
    accessTokenUl,
    twitterConsumerKey,
    twitterConsumerSecret,
    "1.0A",
    'http://' + externalAddress + ":" + backendPort + '/access_token',
    'HMAC-SHA1');

module.exports.redirectToTwitterAuthorizePage = function redirectToTwitterAuthorizePage(req, res, externalAddress, backendPort) {

    getTokenForRedirect().then(sendRedirect)

    function getTokenForRedirect() {
        return new Promise((resolve, reject) => {
            //requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders

            oauth.getOAuthRequestToken({},
                (error, oauthToken, oauthTokenSecret, results) =>
                    resolve({error, oauthToken, oauthTokenSecret, results})
                );
        });
    }

    function sendRedirect(oauth) {
        let {error, oauthToken, oauthTokenSecret, results} = oauth;
        if (error) {
            res.send("Error getting OAuth request token : " + util.inspect(error), 500);
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+oauthToken);
        }
    }
}

module.exports.redirectToTwitterLoginPage  = function redirectToTwitterAuthorizePage(req, res, externalAddress, frontendPort) {
    util.puts(">>"+req.session.oauthRequestToken);
    util.puts(">>"+req.session.oauthRequestTokenSecret);
    util.puts(">>"+req.query.oauth_verifier);
    oauth.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                res.send(
                    "Error getting OAuth access token : "
                    + util.inspect(error)
                    + "["+oauthAccessToken+"]"
                    + "["+oauthAccessTokenSecret+"]"
                    + "["+util.inspect(results)+"]", 500);
            } else {
                req.session.oauthAccessToken = oauthAccessToken;
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                res.redirect('http://' + externalAddress + ":" + frontendPort + '/home-timeline');
            }
        }
    );
}

module.exports.getApplicationToken = function getApplicationToken(resolve) {
    var oauth2 = new OAuth.OAuth2(
        twitterConsumerKey,
        twitterConsumerSecret,
        'https://api.twitter.com/',
        null,
        'oauth2/token',
        null);

    oauth2.getOAuthAccessToken(
        '',
        {'grant_type': 'client_credentials'},
        (e, access_token, refresh_token, results) => {
            console.log('bearer: ', access_token);
            resolve(access_token);
        });
}

module.exports.promiseUserTweetsWithAccessToken = function promiseUserTweetsWithAccessToken(params) {
    return new Promise((resolve, reject) => {
        var {token, name, count, sinceId, maxId} = params;
        var options = {
            url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
        if (count) options.url += "&count=" + count;
        if (sinceId) options.url += "&since_id=" + sinceId;
        if (maxId) options.url += "&max_id=" + maxId;

        oauth.post(options.url, req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, resolve);//url, oauth_token, oauth_token_secret, post_body, post_content_type, callback

    });
}

module.exports.getUserTweetsWithAppToken = function getUserTweetsWithAppToken(params) {
    var {token, name, count, sinceId, maxId} = params;
    var options = {
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+name,
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    if(count) options.url += "&count="+count;
    if(sinceId) options.url += "&since_id="+sinceId;
    if(maxId) options.url += "&max_id="+maxId;

    return rp(options).then((result) => {
        var tweets = JSON.parse(result);
        console.log(tweets); // the tweets!
        return tweets;
    }).catch((e) => console.log(e));

}