# OAuth example
## What is this ?
Some minimalistic NodeJS sample code how to use the following Antwerp services:

* AProfiel

## Getting OAuth access
You will need an OAuth2 client ID and client secret - which can be obtained by filling in this form http://opendata.antwerpen.be/aanvraag-token

You will need :

* A callback URL. This is the URL where the authentication code or OAuth tokens will be sent to. For development purposes, we will set a default callback URL to ```http://localhost:3000/callback``` so you can test on your local machine.
* Application name. Supply a sort name for your application. Application names are on a first come first serve basis.
* First and Lastname of the person requesting access
* A copy of your EID data (PDF)


## Usage

```
npm install
node index.js
```

Then browse to 
```
http://localhost:3000/
```
to start the authentication flow.

## Using the OAuth token
After authenticating the app will consume the /me service, sending the OAuth token in the HTTP header.


### CURL example

```
curl -v -H "Authorization: bearer OAUTH-TOKEN" 'https://api-gw-p.antwerpen.be/astad/aprofiel/v1/v1/me'
```