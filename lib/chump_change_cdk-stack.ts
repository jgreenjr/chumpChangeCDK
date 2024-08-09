import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import { RestApi, ApiKey,UsagePlan, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Cors,ApiKeySourceType} from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ChumpChangeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const postsLambda = new NodejsFunction(this, 'chumpChangeAPI', {
      entry: 'resources/endpoints/chores.ts',
      handler: 'handler',
    });

    const api = new RestApi(this, 'RestAPI', {
      restApiName: 'RestAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // 3. Create our API Key
    const apiKey = new ApiKey(this, 'ApiKey');

    // 4. Create a usage plan and add the API key to it
    const usagePlan = new UsagePlan(this, 'UsagePlan', {
      name: 'Usage Plan',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    // 7. Define our API Gateway endpoints
    const posts = api.root.addResource('chores');
    // The code that defines your stack goes here


    // 8. Connect our Lambda functions to our API Gateway endpoints
    const postsIntegration = new LambdaIntegration(postsLambda);
    // example resource
    // const queue = new sqs.Queue(this, 'ChumpChangeCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    posts.addMethod('GET', postsIntegration, {
      apiKeyRequired: true,
    });
   

    // Misc: Outputs
    new CfnOutput(this, 'API Key ID', {
      value: apiKey.keyId,
    });
  }
}
