var token ='';


            
exports.handler = (event, context, callback)  => {  
    
    var jsonwebtoken = require("jsonwebtoken");
    var key = 'jwtTokenkey';
    var decoded = jsonwebtoken.verify(event.authorizationToken, key);
    var str = decoded.val;
  
  var https = require('https');
    const options = {
              host: 'xxxxxx.execute-api.us-east-1.amazonaws.com',
              port: 443,
              path: '/dev/allowed/'+str,
              method: 'GET'
            };
    var data = '';
  https.request(options, (res) => {
                  
                  res.on('data', (d) => {
                  data += d;
                  });
                  res.on('end', () => {
                     console.log('**********'+data);
                     if(data == 'true'){
                        callback(null, generatePolicy(str, str, 'Allow', event.methodArn, event.authorizationToken));
                        }
                    else{
                          callback("Error: Invalid token");
                    }
                  });
                }).on('error', (e) => {
                  console.error(e);
                  callback(null, e);
                }).end();
  
 /* console.log(str);
    if(str == "true"){
        callback(null, generatePolicy(str, str, 'Allow', event.methodArn, event.authorizationToken));
    }
    else{
        callback("Error: Invalid token");
    }*/
};

var generatePolicy = function(userName, password, effect, resource, token) {
    var authResponse = {};
    
    authResponse.principalId = userName;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    authResponse.context = {
        "stringKey": token,
        "numberKey": 123,
        "booleanKey": true,
        "rohit-auth-token": token,
        "user": userName,
        "password": password
    };
    return authResponse;
}