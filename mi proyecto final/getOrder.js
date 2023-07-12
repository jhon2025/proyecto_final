const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports.handler = async (event) => {
  // Obtener el ID del pedido del evento recibido
  const orderId = event.pathParameters.orderId;

  try {
    // Realizar la lógica para obtener el pedido del bucket de respaldo
    const params = {
      Bucket: 'order-backup-bucket-proyecto',
      Key: `${orderId}.json`,
    };
    const response = await S3.getObject(params).promise();
    const pedido = JSON.parse(response.Body.toString());

    // Retornar la respuesta al cliente con el pedido encontrado
    return {
      statusCode: 200,
      body: JSON.stringify(pedido),
    };
  } catch (error) {
    // Enviar respuesta si no se encuentra el pedido o hay un error
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Pedido no encontrado' }),
    };
  }
};