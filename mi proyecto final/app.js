// Importa los módulos necesarios
const express = require('express');
const mysql = require('mysql2');

// Crea una instancia de Express
const app = express();

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'proyecto-final-dev-mydatabase-p64vrna3gfuh.c4bkalipbium.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12345678',
  database: 'BD_restaurante'
});

// Ruta para manejar la solicitud POST del formulario
app.post('/guardar_cliente', (req, res) => {
  // Recupera los datos del formulario
  const nuevoCliente = {
    nombre_completo: req.body.nombre,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    correo_electronico: req.body.correo
  };

  // Conecta a la base de datos MySQL
  connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos:', error);
      return res.status(500).send('Error al conectar a la base de datos');
    }

    // Ejecuta la consulta SQL INSERT para agregar el cliente
    connection.query('INSERT INTO Cliente SET ?', nuevoCliente, (error, results) => {
      if (error) {
        console.error('Error al agregar el cliente:', error);
        return res.status(500).send('Error al agregar el cliente');
      }
      console.log('Cliente agregado con éxito');

      // Cierra la conexión a la base de datos
      connection.end();

      // Redirige a una página de confirmación o muestra un mensaje de éxito
      res.send('Cliente agregado exitosamente');
    });
  });
});

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor web iniciado en el puerto 3000');
});
