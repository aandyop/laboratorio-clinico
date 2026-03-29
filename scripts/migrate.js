require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function ejecutarMigracionYSeed() {
    const dbName = process.env.DB_NAME || 'laboratorio_clinico';
    const adminEmail = 'admin@laboratorio.com';
    const adminPass = 'admin123';

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true 
    });

    try {
        console.log(`--- Iniciando limpieza total para: ${dbName} ---`);

        // ARREGLO CLAVE: Borrar la base de datos si existe para eliminar FKs antiguas
        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        await connection.query(`CREATE DATABASE \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        const sqlPath = path.join(__dirname, '..', 'laboratorio_prueba.sql');
        let sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Limpieza del SQL para que no interfiera con nuestra conexión
        sqlContent = sqlContent.replace(/CREATE DATABASE IF NOT EXISTS `.*?`;/g, '--');
        sqlContent = sqlContent.replace(/USE `.*?`;/g, '--');
        sqlContent = sqlContent.replace(/START TRANSACTION;/g, '--');
        sqlContent = sqlContent.replace(/COMMIT;/g, '--');

        // Inyectamos la desactivación de checks en la misma ejecución del SQL
        const sqlFinal = `
            SET FOREIGN_KEY_CHECKS = 0;
            SET UNIQUE_CHECKS = 0;
            ${sqlContent}
            SET FOREIGN_KEY_CHECKS = 1;
            SET UNIQUE_CHECKS = 1;
        `;

        console.log("1. Importando esquema limpio...");
        await connection.query(sqlFinal);
        console.log("   ✔ Estructura creada con éxito.");

        // SEEDING: Administrador
        console.log("2. Creando administrador...");
        const hashedPassword = await bcrypt.hash(adminPass, 10);
        await connection.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            ['Admin Sistema', adminEmail, hashedPassword, 'ADMIN']
        );
        
        console.log("\n🚀 ¡Migración completada! Ya puedes iniciar sesión.");

    } catch (error) {
        console.error("\n❌ Error durante la migración:", error.message);
    } finally {
        await connection.end();
    }
}

ejecutarMigracionYSeed();