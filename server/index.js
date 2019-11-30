const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const cookiepars = require('cookieparser')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

global.fetch = require('node-fetch');
require('dotenv').config();
 
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {

  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server

  const userPool = new AmazonCognitoIdentity.CognitoUserPool({    
    UserPoolId : process.env.UserPoolId,  // Pool Id
    ClientId : process.env.ClientId, // App client id
  });

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false })) 
  app.use(bodyParser.json())
 
  app.post('/auth/register', (req, res, next) => { 
    
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: req.body.email}),
      new AmazonCognitoIdentity.CognitoUserAttribute({Name: "phone_number", Value: req.body.phone}),
      new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:role", Value: "dealer"})
    ]

    userPool.signUp(req.body.email, req.body.password, attributeList, null, function(err, result){
        if (err) { 
          try {
            err.message = err.message;
            return res.status(400).json({error: err});
          } catch (err) {
            console.log(err);
            return res.status(500)
          } 
        } 
        cognitoUser = result.user;
        res.json({user: cognitoUser.getUsername()});
    }); 
  })

  app.post('/auth/login', (req, res, next) => {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username : req.body.email,
      Password : req.body.password,
    }); 

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username : req.body.email,
      Pool : userPool
    }); 
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) { 
          const expirationTime = new Date(result.getAccessToken().payload.exp*1000)
          const auth = {
            jwt: result.getAccessToken().getJwtToken(),
            jwt_expired: expirationTime,
            email: req.body.email
          } 
          res.cookie('token', result.getRefreshToken().getToken(), { 
            expires: new Date(result.getAccessToken().payload.auth_time * 1000 + 1000*60*60*24*30), 
            httpOnly: true }).json(auth); 
        }, 
        onFailure: function(err) {
          if (err) { 
            try {
              err.message = err.message;
              return res.status(400).json({error: err});
            } catch (err) {
              console.log(err);
              return res.status(500)
            } 
          }
        },
    }); 
  })

  app.post('/auth/logout', (req, res) => {
    res.cookie('token','', { 
      expires: new Date(Date.now()), 
      httpOnly: true }).json({ ok: true });
  }) 

  app.post('/auth/refresh-token', (req, res) => {   
    if (req.headers.cookie) { 
      const parsed = cookiepars.parse(req.headers.cookie) 
      const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: parsed.token}); 
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username : '',
        Pool : userPool
      }); 

      cognitoUser.refreshSession(refreshToken, (err, result) => {
        if (err) {
          res.status(401).json({ message: 'The Access Token expired' })
        } else {
          const expirationTime = new Date(result.getAccessToken().payload.exp*1000) 
          const auth = {
              jwt: result.getIdToken().getJwtToken(),
              jwt_expired: expirationTime,
              email: result.getIdToken().payload.email,
              refresh_token: result.getRefreshToken().getToken(),
              refresh_token_expired: new Date(result.getIdToken().payload.auth_time * 1000 + 1000*60*60*24*30)
            } 
          res.cookie('token', result.getRefreshToken().getToken(), { 
            expires: new Date(result.getAccessToken().payload.auth_time * 1000 + 1000*60*60*24*30), 
            httpOnly: true }).json(auth);
        }
      }) 
    } else {
      res.status(401).json({ message: 'Missing auth cookie' })
    }
  }) 

  app.post('/auth/confirm', (req, res, next) => {
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username : req.body.email,
      Pool : userPool
    }); 

    cognitoUser.confirmRegistration(req.body.code, true, function(err, result) {
      if (err) {
        console.log(err);
        err.message = err.message;
        return res.status(400).json({error: err.message});
      }       
      res.json({success: true});
    })
  })
 
  app.use(nuxt.render)
  
  app.listen(port, host)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
