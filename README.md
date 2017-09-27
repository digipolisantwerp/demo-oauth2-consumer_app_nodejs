# OAuth2 example application
## What is this ?
Some minimalistic NodeJS sample code how to use the following Antwerp services:

* AProfiel
* MProfiel

## Getting OAuth tokens
You will need an OAuth2 client ID and client secret - which can be obtained here:
https://developer.antwerpen.be/

You will need :

* A callback URL. This is the URL where the authentication code or OAuth tokens will be sent to. For development purposes, we will set a default callback URL to ```http://localhost:3000/callback``` so you can test on your local machine.
* Application name. Supply a sort name for your application. Application names are on a first come first serve basis.
* First and Lastname of the person requesting access
* A copy of your EID data (PDF)


## How to consume the Aprofile API

### Run application using docker-compose
* Update .env file with your client ID and client secret for AProfiel and MProfiel
* Run `docker-compose -f docker-compose.dev.yml up`

### Run application using node
* Update config/services.config.js with your client ID and client secret for AProfiel and MProfiel
* npm install && node app.js

### Authenticate
Then browse to http://localhost:3000/ to start the authentication flow. 
The will generate a 302 redirect to the authorize application.

```
https://api-oauth2.antwerpen.be/v1/authorize?
response_type=code
&service=astad.aprofiel.v1
&client_id=YOUR_CLIENT_ID
&scope=astad.aprofiel.v1.username%20astad.aprofiel.v1.name%20astad.aprofiel.v1.avatar%20astad.aprofiel.v1.email%20astad.aprofiel.v1.phone
&redirect_uri=YOUR_REDIRECT_URI
&redirect_uri_lng=true
&state=thisParameterWillBeAddedToTheRedirectUri
&lng=nl
&force_auth=true
```


| Parameter | Required | Description |
| :---         |     :---:      |  :---   |
| response_type   | true     | Response type should be 'code'.    |
| client_id     | true       | client_id for your registered application.      |
| scope     | true       | List of space separated scopes the user should approve.      |
| redirect_uri     | true       | redirect_uri for your registered application.       |
| redirect_uri_lng     | false       | if set to 'true' the redirect_uri will have an extra parameter 'lng' in the redirect_uri when the user leaves the logon application. The value for the 'lng' querystring parameter will be the language that was used on the logon application.      |
| service     | true       | The service you want to use to authenticate a user.  Can be 'astad.aprofiel.v1' or 'astad.mprofiel.v1'.    |
| state     | false      | We recommend using this parameter to add an identifier for the user's session. Since the state parameter is added to the redirect_uri, your application can validate the OAuth2 flow started from your application.      |
| lng     | false       | The language the logon application should use. Defaults to 'nl'. Available languages are nl, fr, en, de.     |
| force_auth     | false       | By default the IDP behind the logon application initiates an SSO session. If you want to force a user to authenticate again you should set this parameter to 'true'.     |

### Exchange authorization_code for access_token
After successful authentication you will be redirected to the redirect_uri of your registered application.
A querystring parameter"code" will be added to this redirect_uri. You can use this code to obtain an access_token.
```
curl -X POST -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=CODE_FROM_URI&grant_type=authorization_code" https://api-gw-p.antwerpen.be/astad/aprofiel/v1/oauth2/token
```
Make sure your framework/library adds header "Content-Type application/x-www-form-urlencoded".

Your response should look something like this:
```
{"refresh_token":"66f0c43c27a94ad4aa2d7574cf7b4465","token_type":"bearer","access_token":"a2824fb10b2a44b2b6f1a4aba382630a","expires_in":7200}
```
Access tokens expire after 7200 seconds (2 hours).

### Call the Aprofile API


```
curl -v -H "Authorization: Bearer ACCESS_TOKEN_FROM_PREVIOUS_STEP" 'https://api-gw-p.antwerpen.be/astad/aprofiel/v1/v1/me'
```
response
```
{
	"success": true,
	"data": {
		"id": "1a2b3c4d5e6f7g63998b4576",
		"userName": "ConsentAcc",
		"firstName": "John",
		"lastName": "Doe",
		"avatarUrl": "https://assets.antwerpen.be/img.png",
		"emailPrimary": "you@domain.com",
		"phonePrimary": "+32 499 12 34 56"
	}
}
```

### Refresh an access_token
Access tokens expire after 7200 seconds (2 hours) and can be refreshed for 2 weeks.

Request
```
curl -X POST -d "grant_type=refresh_token&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&refresh_token=REFRESH_TOKEN_FROM_TOKEN_RESPONSE" https://api-gw-p.antwerpen.be/astad/aprofiel/v1/oauth2/token
```
Response
```
{"refresh_token":"66f0c43c27a94ad4aa2d7574cf7b4463","token_type":"bearer","access_token":"b2824fb10b2a44b2b6f1a4aba382630a","expires_in":7200}
```
