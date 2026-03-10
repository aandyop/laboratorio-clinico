require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrarTodo() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    try {
        console.log("Iniciando proceso de migración total...");

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log(`Base de datos '${process.env.DB_NAME}' lista.`);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS medicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                especialidad VARCHAR(100) NOT NULL,
                codigo_colegiado VARCHAR(50) UNIQUE NOT NULL
            )
        `);
        console.log("Tabla 'medicos' creada.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                cedula VARCHAR(20) UNIQUE NOT NULL,
                telefono VARCHAR(20),
                medico_id INT,
                FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE SET NULL
            )
        `);
        console.log("Tabla 'pacientes' creada.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS examenes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                paciente_id INT NOT NULL,
                tipo_examen VARCHAR(100) NOT NULL,
                resultado TEXT,
                fecha DATE NOT NULL,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
            )
        `);
        console.log("Tabla 'examenes' creada (con borrado en cascada).");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS facturas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                paciente_id INT NOT NULL,
                monto_total DECIMAL(10, 2) NOT NULL,
                metodo_pago VARCHAR(50) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
            )
        `);
        console.log("Tabla 'facturas' creada.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_insumo VARCHAR(100) NOT NULL,
                cantidad_stock INT NOT NULL,
                unidad_medida VARCHAR(50) NOT NULL,
                fecha_vencimiento DATE
            )
        `);
        console.log("Tabla 'inventario' creada.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS valores_referencia (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_examen VARCHAR(100) NOT NULL,
                valor_minimo DECIMAL(10, 2) NOT NULL,
                valor_maximo DECIMAL(10, 2) NOT NULL,
                unidad VARCHAR(20) NOT NULL
            )
        `);
        console.log("Tabla 'valores_referencia' creada.");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                rol ENUM('ADMIN', 'USER') DEFAULT 'USER',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tabla 'usuarios' creada para autenticación.");

        console.log("\n ¡MIGRACIÓN COMPLETADA! El sistema está listo para usarse.");

    } catch (error) {
        console.error("ERROR DURANTE LA MIGRACIÓN:");
        console.error(error.message);
    } finally {
        await connection.end();
        process.exit();
    }
}

migrarTodo();