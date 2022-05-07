import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidV4 } from 'uuid';
import { document } from '../utils/dynamodbClient';

interface ICreateTodoTask {
  userid: string;
  title: string;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodoTask;
  const uuid = uuidV4();
  await document
    .put({
      TableName: 'todos',
      Item: {
        id: uuid,
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Tarefa criada com sucesso.',
    }),
  };
};
