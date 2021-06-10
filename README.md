# OAuth2 example application

## What is this ?

Some minimalistic NodeJS sample code how to use the following Antwerp services:

* AProfiel
* MProfiel

## Getting OAuth tokens

You will need an OAuth2 client ID and client secret - which can be obtained here:

* https://api-store-o.antwerpen.be
* https://api-store-a.antwerpen.be
* https://api-store.antwerpen.be

You will need :

* A callback URL. This is the URL where the authentication code or OAuth tokens will be sent to. For development purposes, we will set a default callback URL to ```http://localhost:3000/callback``` so you can test on your local machine.
* Application name. Supply a sort name for your application. Application names are on a first come first serve basis.
* First and Lastname of the person requesting access
* A copy of your EID data (PDF)

## How to consume the AProfiel (or MProfiel) API

### Run application using docker-compose

* Update .env file with your client ID and client secret for AProfiel (or MProfiel)
* Run `docker-compose -f docker-compose.dev.yml up --build`

### Run application using node

* Update config/services.config.js with your client ID, client secret for AProfiel (or MProfiel)
* Run `npm install && node app.js` or `npm run dev` to run the app in development mode

### Authenticate

Then browse to http://localhost:3000/ to start the authentication flow.
The will generate a 302 redirect to the authorize application.

```
https://api-oauth2.antwerpen.be/v1/authorize?
response_type=code
&service=astad.aprofiel.v1
&client_id=YOUR_CLIENT_ID
&scope=astad.aprofiel.v1.username%20astad.aprofiel.v1.name%20astad.aprofiel.v1.avatar%20astad.aprofiel.v1.email%20astad.aprofiel.v1.phone
&redirect_uri=http://localhost:3000/callback/aprofiel
&redirect_uri_lng=true
&state=thisParameterWillBeAddedToTheRedirectUri
&lng=nl
&force_auth=true
&save_consent=false
&auth_type=form
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
| save_consent | false | If set to 'true', the consent page will only be shown on the first logon. |
| auth_type | so / form | **login** type for `mProfile` form for "internal" **so** for `stedelijk onderwijs`. Defaults to internal

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

### Call the AProfiel API

Request:

```
curl -v -H "Authorization: Bearer ACCESS_TOKEN_FROM_PREVIOUS_STEP" 'https://api-gw-p.antwerpen.be/astad/aprofiel/v1/v1/me'
```

Response:

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

Request:

```
curl -X POST -d "grant_type=refresh_token&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&refresh_token=REFRESH_TOKEN_FROM_TOKEN_RESPONSE" https://api-gw-p.antwerpen.be/astad/aprofiel/v1/oauth2/token
```

Response:

```
{"refresh_token":"66f0c43c27a94ad4aa2d7574cf7b4463","token_type":"bearer","access_token":"b2824fb10b2a44b2b6f1a4aba382630a","expires_in":7200}
```

## Logout flow

In order to log out a **browser redirect to `https://api-oauth2.antwerpen.be/<v1/v2>/logout/redirect/encrypted`** (or `api-oauth2-<o/a>.antwerpen.be` for DEV/ACC) needs to be made with these query string parameters:

| Param     | Description                                                                                                                       |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------|
| client_id | client_id of the api-store contract                                                                                               |
| service   | the service to log out, e.g. "astad.mprofiel.v1"                                                                                  |
| data      | additional parameters encrypted, see below                                                                                        |
| auth_type | optional: use the same `auth_type` which was passed to the login redirect (if set to "so", Azure logout for SO will be triggered) |

The structure of the data object is as folows:

| Data param  	| Description                                           |
| ------------- 	| ------------- 			                                 |
| user_id  		| The id of the user to log out ex. profileId  |
| access_token  		| The access token of the user to log out                   |
| redirect_uri  		| The uri to redirect to at the end of the logout flow          |

The data object must be encrypted. This can be done using the **encrypt** method of the [logout.js](/app/utils/logout.js) file, using the client secret as the password.

After a call to the /logout/redirect/encrypted endpoint a redirect logout flow will initiate and will terminate at the **redirect_uri** if all went well.

### Logout events

When a user is logged out an event is published on the Event Handler.
You can subscribe to these events in the **OAuth** namespace:

**astad.aprofiel.v1.loggedout** in case the user was logged in with AProfiel.
**astad.mprofiel.v1.loggedout** in case the user was logged in with MProfiel.

The event payload is:

```
{
  user: <user id>,
  service: <the service the user was logged in>,
  timestamp: <ISO date and time>
}
```

## Contributing

Pull requests are always welcome, however keep the following things in mind:

- New features (both breaking and non-breaking) should always be discussed with the [repo's owner](#support). If possible, please open an issue first to discuss what you would like to change.
- Fork this repo and issue your fix or new feature via a pull request.
- Please make sure to update tests as appropriate. Also check possible linting errors and update the CHANGELOG if applicable.

## Support

Peter Brion (<peter.brion@digipolis.be>)
