

import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb';
import { PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { IChores } from '../../types';

const dynamodb = new DynamoDB({});

export async function addChore(body: string | null) {

  const uuid = randomUUID();

  // If no body, return an error
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing body' }),
    };
  }


  // Parse the body
  const bodyParsed = JSON.parse(body) as IChores;

  // Creat the post
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.CHORE_TABLE_NAME,
      Item: {
        pk: `Chore#${uuid}`,
        ...bodyParsed,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Post created', id: `Chore#${uuid}` }),
  };
};

export async function GetChore(choreID: string) {
  if (!choreID) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name' }),
    };
  }

  let result = await dynamodb.send(new GetCommand({
    TableName: process.env.CHORE_TABLE_NAME,
    Key: {
      pk: `Chore#${choreID}`,
    }
  }))


  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Post not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  }
}

export async function GetChores(field:string, value:string) {
  if(!field ){
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing field' }),
    };
  }
  if(!value ){
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing value' }),
    };
  }
  const command = new ScanCommand({
    TableName: process.env.CHORE_TABLE_NAME, 
    ExpressionAttributeValues: {
      ":searchKey": { S: value },
    },
    FilterExpression: `contains (${field}, :searchKey)`
  });
  
  let result = await dynamodb.send(command)
  if (!result.Items) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Post not found' }),
    };
  }

  return {
 
      statusCode: 200,
      body: JSON.stringify(result.Items)
    
  }


}
