const { Stack, Duration, CfnOutput} = require('aws-cdk-lib');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const nodeJS = require('aws-cdk-lib/aws-lambda-nodejs')
const path = require('path');
const { HttpLambdaIntegration } = require('aws-cdk-lib/aws-apigatewayv2-integrations');
const apigwv2 = require("aws-cdk-lib/aws-apigatewayv2")
// const sqs = require('aws-cdk-lib/aws-sqs');
// Import the Lambda module
const lambda = require('aws-cdk-lib/aws-lambda');
class ChumpChangeCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ChumpChangeCdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

       // Modify the Lambda function resource
    const myFunction = new nodeJS.NodejsFunction(this, "choresMethods", {
      runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
      entry: path.join(__dirname,'chores/index.js')
    });
    
    
  }
}

module.exports = { ChumpChangeCdkStack }
