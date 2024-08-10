import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import { RestApi, ApiKey,UsagePlan, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Cors,ApiKeySourceType} from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput } from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ChumpChangeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// 1. Create our DynamoDB table
const choreTable = new Table(this, 'choreTable', {
    partitionKey: { name: 'pk', type: AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: BillingMode.PAY_PER_REQUEST,
});
    const postsLambda = new NodejsFunction(this, 'chumpChangeAPI', {
      entry: 'resources/chores/endpoints/chores.ts',
      handler: 'handler',
      environment:{
        CHORE_TABLE_NAME: choreTable.tableName
      }
    });
    
    choreTable.grantReadWriteData(postsLambda);

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
    posts.addMethod('POST', postsIntegration, {
      apiKeyRequired: true,
    });
   

    // Misc: Outputs
    new CfnOutput(this, 'API Key ID', {
      value: apiKey.keyId,
    });
  }
}
