// ./resources/endpoints/post.ts

import { APIGatewayProxyEvent } from 'aws-lambda';
import { addChore} from '../handlers/addChore'

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters?.id;

  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'get' }),
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