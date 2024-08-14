// ./resources/endpoints/post.ts

import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { addChore, GetChore,GetChores} from '../handlers/addChore'

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        if(event.pathParameters?.id)
          return GetChore(event.pathParameters?.id);
        if(event.queryStringParameters)
          return GetChores(event.queryStringParameters['field']||"", event.queryStringParameters['value']||"")
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' }),
        };
      case 'POST':
        return addChore(event.body)
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' }),
        };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};