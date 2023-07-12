Proyecto Final - Toma de Pedidos a Domicilio
Este proyecto tiene como objetivo reforzar los conocimientos adquiridos durante nuestras clases y promover la investigación propia y la resolución de problemas. Implementaremos una infraestructura completa utilizando CloudFormation en AWS para garantizar que todos los recursos estén en un solo lugar.

Descripción del Proyecto
Vamos a crear una aplicación completa para la toma de pedidos a domicilio de un restaurante. Nos enfocaremos en la infraestructura y no en los detalles de las tablas y el código en sí. La aplicación permitirá a los clientes realizar pedidos proporcionando la siguiente información:

Cliente:

Nombre completo
Dirección
Teléfono
Correo electrónico
Pedido:

Producto
Cantidad
Valor unidad
Valor total
Una vez que el cliente realice un pedido, recibirá una notificación por correo electrónico con los detalles del pedido. Además, el pedido se colocará en una cola para su procesamiento y envío.

Los dueños del restaurante podrán acceder a través de un API Gateway que proporcionará dos servicios:

POST: Para crear un pedido
GET: Para buscar un pedido por ID
Cada pedido se almacenará en un bucket de respaldo y los archivos se eliminarán automáticamente del bucket cada 2 días.

Pasos para la Implementación
Sigue los pasos a continuación para implementar el proyecto:

Crear la Infraestructura en AWS

Asegúrate de tener una cuenta de AWS y haber configurado tus credenciales localmente para el acceso.

Instala el framework Serverless si aún no lo tienes instalado en tu entorno de desarrollo.

Crea un archivo serverless.yml en la raíz del proyecto con la siguiente configuración:

yaml
Copy code
service: proyecto-final

frameworkVersion: "3"

provider:
  name: aws
  runtime: nodejs14.x
  region: us-east-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - ses:SendEmail
      Resource:
        - arn:aws:ses:us-east-1:925866048760:identity/alejo17hernandez795@gmail.com
        - arn:aws:ses:us-east-1:925866048760:identity/hernandezjhon795@gmail.com

resources:
  Resources:
    MyDatabase: 
      Type: AWS::RDS::DBInstance
      Properties:
        AllocatedStorage: 20
        DBInstanceClass: db.t2.micro
        Engine: MySQL
        EngineVersion: 5.7
        MasterUsername: admin
        MasterUserPassword: 12345678
        MultiAZ: false
        StorageType: gp2
        PubliclyAccessible: true

    MyOrderQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: order-queue
        DelaySeconds: 15
        MessageRetentionPeriod: 1209600

    MyOrderBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: order-backup-bucket-proyecto
        LifecycleConfiguration:
          Rules:
            - Id: DeleteAfterTwoDays
              Status: Enabled
              ExpirationInDays: 2

    DestinatarioEmailVerification:
      Type: AWS::SES::EmailIdentity
      Properties:
        EmailIdentity: alejo17hernandez795@gmail.com

    OrigenEmailVerification:
      Type: AWS::SES::EmailIdentity
      Properties:
        EmailIdentity: hernandezjhon795@gmail.com

    LambdaExecutionRole:
      Type: "AWS::IAM::Role"
      Properties:
        RoleName: proyecto-final-dev-createOrder
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: "Allow"
              Principal:
                Service: "lambda.amazonaws.com"
              Action: "sts:AssumeRole"
        Policies:
          - PolicyName: "SESAccessPolicy"
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: "Allow"
                  Action:
                    - "ses:SendEmail"
                  Resource:
                    - "arn:aws:ses:us-east-1:925866048760:identity/alejo17hernandez795@gmail.com"
                    - "arn:aws:ses:us-east-1:925866048760:identity/hernandezjhon795@gmail.com"
Asegúrate de reemplazar los valores necesarios, como los nombres de los recursos y las direcciones de correo electrónico.

Ejecuta el siguiente comando en la línea de comandos para crear los recursos en AWS:

Copy code
sls deploy
Implementar el Backend de la Aplicación

Crea los siguientes archivos en la raíz del proyecto para implementar el backend de la aplicación:

app.js: Configura la conexión a la base de datos y maneja las solicitudes POST del formulario.
createOrder.js: Procesa el pedido y lo coloca en la cola, además de enviar una notificación por correo electrónico.
getOrder.js: Recupera un pedido específico del bucket de respaldo.
processOrder.js: Maneja el procesamiento periódico de los pedidos acumulados en la cola.
Copia y pega el código correspondiente en cada uno de los archivos según se muestra en tu consulta original.

Implementar el Frontend de la Aplicación

Crea el siguiente archivo en la raíz del proyecto para implementar el frontend de la aplicación:

index.html: Contiene el formulario HTML para que los clientes realicen un pedido.
Copia y pega el código HTML del formulario según se muestra en tu consulta original.

Probar y Verificar Funcionalidad

Ejecuta tu aplicación localmente utilizando el siguiente comando en la línea de comandos:
sql
Copy code
sls offline start
Abre tu navegador y accede a http://localhost:3000 para probar y completar el formulario de cliente.
Verifica que los datos se guarden en la base de datos, se coloquen en la cola y se envíe la notificación por correo electrónico.
Autor
Nombre: Jhon Alejandro Hernandez Trejos
ID de Estudiante: 266670
Programa de Estudios: Tecnología en Sistemas Informáticos
Ubicación: Riosucio, Caldas
