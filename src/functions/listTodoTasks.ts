import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

interface ITodoTask {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .query({
      TableName: 'todos',
      IndexName: 'userId',
      KeyConditionExpression: 'user_id = :userid',
      ExpressionAttributeValues: {
        ':userid': userid,
      },
    })
    .promise();

  const todosList = response.Items as ITodoTask[];

  return {
    statusCode: 200,
    body: JSON.stringify({
      todosList,
    }),
  };
};
