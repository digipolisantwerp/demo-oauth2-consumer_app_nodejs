# OAuth2 example application
## What is this ?
Some minimalistic NodeJS sample code how to use the following Antwerp services:

* AProfiel

## Getting OAuth tokens
You will need an OAuth2 client ID and client secret - which can be obtained here:
https://developer.antwerpen.be/

You will need :

* A callback URL. This is the URL where the authentication code or OAuth tokens will be sent to. For development purposes, we will set a default callback URL to ```http://localhost:3000/callback``` so you can test on your local machine.
* Application name. Supply a sort name for your application. Application names are on a first come first serve basis.
* First and Lastname of the person requesting access
* A copy of your EID data (PDF)


## How to consume the Aprofile API

### Install application
* update config/services.yml with your client_id, client_secret and redirect_uri
* npm install && node index.js

### Authenticate
Then browse to http://localhost:3000/ to start the authentication flow. 
The will generate a 302 redirect to the authorize application.

```
https://api-oauth2.antwerpen.be/v1/authorize?
response_type=code&
service=AStad-AProfiel-v1&
client_id=YOUR_CLIENT_ID
client_secret=YOUR_CLIENT_SECRET
scope=username%20name%20avatar%20email%20phone&
redirect_uri=YOUR_REDIRECT_URI
&lng=nl
```

#Exchange authorisation code for access token
After successful authentication you will be redirected to the redirect_uri of your registered application.
A "code" querystring parameter will be added to this redirect_uri.
```
curl -X POST -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=CODE_FROM_URI&grant_type=authorization_code" https://api-gw-p.antwerpen.be/astad/aprofiel/v1/oauth2/token
```
Make sure your framework/library adds header "Content-Type application/x-www-form-urlencoded".

Your response should look something like this:
```
{"refresh_token":"66f0c43c27a94ad4aa2d7574cf7b4465","token_type":"bearer","access_token":"a2824fb10b2a44b2b6f1a4aba382630a","expires_in":7200}
```

# Call the Aprofile API


```
curl -v -H "Authorization: Bearer ACCESS_TOKEN_FROM_PREVIOUS_STEP" 'https://api-gw-p.antwerpen.be/astad/aprofiel/v1/v1/me'
```


### Response

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
