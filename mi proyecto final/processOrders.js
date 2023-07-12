const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

module.exports.handler = async (event) => {
  try {
    // Obtener los pedidos acumulados de la cola
    const queueUrl = 'https://sqs.us-east-1.amazonaws.com/925866048760/order-queuesss'; // Reemplaza con la URL de tu cola de mensajes
    const params = {
      QueueUrl: queueUrl,
      AttributeNames: ['All'],
      MessageAttributeNames: ['All'],
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 0,
    };
    const response = await sqs.receiveMessage(params).promise();
    const { Messages } = response;

    // Procesar cada pedido
    if (Messages && Messages.length > 0) {
      for (const message of Messages) {
        const pedido = JSON.parse(message.Body);

        // Realizar las acciones necesarias para procesar el pedido
        // Ejemplo: enviar el pedido al restaurante

        // Eliminar el mensaje de la cola después de procesarlo
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        await sqs.deleteMessage(deleteParams).promise();
      }
    }

    // Retornar la respuesta indicando el número de pedidos procesados
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `${Messages ? Messages.length : 0} pedidos procesados` }),
    };
  } catch (error) {
    // Manejar errores
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al procesar los pedidos' }),
    };
  }
};