'use strict';

exports.pdiVerificationAccountsGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * sortcode (List)
  * accountID (List)
  * accountHolderName (List)
  * verificationType (List)
  **/
  var log4js = require( "log4js" );
  log4js.configure( "./config/log4js.json" );
  var logger = log4js.getLogger( "orch-file-appender" );
  logger.debug("Entered Orch Services Layer");
    var examples = {};
  examples['application/json'] = {
  "Verification" : {
    "Accounts" : [ {
      "sortcode" : "12345",
      "accountHolderName" : "Ritushree",
      "accountID" : "849490309",
      "expenditureVerification" : "Not defaulter"
    }, {
      "sortcode" : "12344",
      "accountHolderName" : "Adam",
      "accountID" : "8494903129",
      "incomeVerification" : "Verified and positive"
    } ]
  }
};
if(args.accountID.value.length != args.accountHolderName.value.length || args.sortcode.value.length != args.accountHolderName.value.length  || args.accountID.value.length != args.sortcode.value.length)
{//TO DO VerificationType comparisions
res.statusCode=400;
  logger.error("Missing Mandatory Fields/Incorrect data");
var err={"ErrorCode":"BUS03","ErrorReason":"Missing Mandatory Fields/Incorrect data"};
res.end(JSON.stringify({"Error":err} || {}, null, 2));

}

else if(args.accountID.value.length == 1) {

//  res.setHeader('Content-Type', 'application/json');
//    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
var filter=args.verificationType.value;
var accountID=args.accountID.value;
var accountHolderName=args.accountHolderName.value;
var sortcode=args.sortcode.value
var length=accountID.length;

var request = require('request');
var url ;
var i;
var resultObject=new Array(length);
var id;
res.setHeader('Content-Type', 'application/json');

var imresutlObject=new Array(length);

for( i=0;i<length;i++){
//if(filter[i]=="IN")
//{
url=sortcode[i] +'+'+accountID[i] ;
//+'+' +accountHolderName[i];
logger.info("Calling Micro services with sortcode "+  sortcode[i] +" accountID " + accountID[i] +"and accountHolderName " + accountHolderName[i]);

micro(url ,accountHolderName[i],filter,res,function(resp)
{
  if(resp.ErrorCode)
  {logger.error("Error returned from micro services");
    res.end(JSON.stringify({"Error":resp} || {}, null, 2));
  }
  else{logger.info("Response from micro services");
//  resultObject[0]="[";
    resultObject[0]=resp.Account;
//resultObject[2]="]";
if(resultObject[0] !=null)
res.end(JSON.stringify({"Verification": {"accounts" :resultObject }}|| {}, null, 2));
else
{//TO DO VerificationType comparisions
res.statusCode=500;
logger.error("Could not reach the underlying service");
var err={"ErrorCode":"BUS02","ErrorReason":"Could not reach the underlying service"};
res.end(JSON.stringify({"Error":err} || {}, null, 2));

}
}

//}
}
);

}
//



//return resultObject[i];

}
else if(args.accountID.value.length > 1) {
  logger.info("Displaying examples");
  res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
}
else {
res.end();
}

}
function micro(url,name,verificationType,res, callback) {
  var request = require('request');

    var options = {

        uri : encodeURI("http://localhost:10010/pdi/accounts/"+url+"?accountHolderName="+name+"&verificationType="+verificationType),
        method : 'GET'
    };
    var result = '';
    request(options, function (error, response, body) {
      console.log("options.uri is :: "+options.uri);


        if (!error && response.statusCode == 200) {
           result = JSON.parse(body);
           res.statusCode=200;
          }
        else {
          if(body)
            {result = JSON.parse(body);
              res.statusCode=response.statusCode ;
            }
            else {
              result='Cant reach';
            }
        }
        callback(result);
    });
}
function responsemake(args,callback){

//callback(imresutlObject);
}
