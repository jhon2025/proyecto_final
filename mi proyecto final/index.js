const express = require('express');
const mysql = require('mysql');

// Crear conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'proyecto-final-dev-mydatabase-p64vrna3gfuh.c4bkalipbium.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'BD_restaurante'
});

// Conectar a la base de datos MySQL
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Crear una instancia de la aplicación Express
const app = express();

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para procesar el formulario y guardar los datos en la base de datos
app.post('  https://ngrjnuoaoi.execute-api.us-east-1.amazonaws.com/dev/orders', (req, res) => {
    // Obtener los datos del formulario enviados en el cuerpo de la solicitud
    const { nombre, direccion, telefono, correo, producto, cantidad, valor_unidad, valor_total } = req.body;

    // Crear una consulta SQL para insertar los datos en la tabla "Cliente" y "Pedido"
    const insertClienteSql = `INSERT INTO Cliente (nombre_completo, direccion, telefono, correo_electronico) 
                               VALUES (?, ?, ?, ?)`;
    const insertPedidoSql = `INSERT INTO Pedido (producto, cantidad, valor_unidad, valor_total) 
                             VALUES (?, ?, ?, ?)`;

    // Ejecutar las consultas SQL con los datos del formulario
    connection.query(insertClienteSql, [nombre, direccion, telefono, correo], (error, results) => {
        if (error) {
            console.error('Error al insertar datos en la tabla "Cliente":', error);
            res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
            return;
        }

        // Obtener el ID del cliente insertado
        const clienteId = results.insertId;

        connection.query(insertPedidoSql, [producto, cantidad, valor_unidad, valor_total], (error, results) => {
            if (error) {
                console.error('Error al insertar datos en la tabla "Pedido":', error);
                res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
                return;
            }

            // Obtener el ID del pedido insertado
            const pedidoId = results.insertId;

            console.log('Datos insertados correctamente');
            res.json({ message: 'Datos insertados correctamente', clienteId, pedidoId });
        });
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor en ejecución en el puerto 3000');
});