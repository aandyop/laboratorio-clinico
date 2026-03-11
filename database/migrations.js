require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'laboratorio_clinico'
    });

    console.log("Conectado a MySQL para migración...");

    const saltRounds = 10;
    const adminPass = await bcrypt.hash('admin123', saltRounds);
    const userPass = await bcrypt.hash('user123', saltRounds);

    try {
        // 1. Tabla de Usuarios
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                rol ENUM('ADMIN', 'USER')
            ) ENGINE=InnoDB;
        `);

        // 2. Tabla de Médicos
        await connection.query(`
            CREATE TABLE IF NOT EXISTS medicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                especialidad VARCHAR(100),
                codigo_colegiado VARCHAR(50) UNIQUE
            ) ENGINE=InnoDB;
        `);

        // 3. Tabla de Pacientes
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                cedula VARCHAR(20) UNIQUE NOT NULL,
                telefono VARCHAR(20),
                medico_id INT NULL,
                CONSTRAINT fk_paciente_medico FOREIGN KEY (medico_id) 
                    REFERENCES medicos(id) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);

        // 4. Tabla de Exámenes
        await connection.query(`
            CREATE TABLE IF NOT EXISTS examenes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                paciente_id INT,
                tipo_examen VARCHAR(100),
                resultado TEXT,
                fecha DATE,
                FOREIGN KEY(paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        // 5. Tabla de Inventario
        await connection.query(`
            CREATE TABLE IF NOT EXISTS inventario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_insumo VARCHAR(100) NOT NULL,
                cantidad_stock INT DEFAULT 0,
                unidad_medida VARCHAR(20),
                fecha_vencimiento DATE
            ) ENGINE=InnoDB;
        `);

        // 6. Tabla de Valores de Referencia
        await connection.query(`
            CREATE TABLE IF NOT EXISTS valores_referencia (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_examen VARCHAR(100) NOT NULL,
                valor_minimo DECIMAL(10,2),
                valor_maximo DECIMAL(10,2),
                unidad VARCHAR(20)
            ) ENGINE=InnoDB;
        `);

        // 7. Tabla de Facturas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS facturas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                paciente_id INT,
                monto_total DECIMAL(10,2),
                fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metodo_pago VARCHAR(50),
                FOREIGN KEY(paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        // --- USUARIOS DE PRUEBA ---
        await connection.query(`
            INSERT IGNORE INTO usuarios (nombre, email, password, rol) VALUES 
            ('Administrador', 'admin@laboratorio.com', ?, 'ADMIN'),
            ('Empleado', 'empleado@laboratorio.com', ?, 'USER')
        `, [adminPass, userPass]);

        console.log("Estructura completa de base de datos creada con éxito.");

    } catch (error) {
        console.error("Error en la migración:", error.message);
    } finally {
        await connection.end();
    }
}

migrate();