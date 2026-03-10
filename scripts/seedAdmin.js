require('dotenv').config();
const Usuario = require('../models/Usuario');

async function crearAdmin() {
    try {
        console.log("Creando usuario administrador inicial...");
        
        // Datos de acceso de Administrador
        const id = await Usuario.crear({
            username: 'admin',
            password: '12345678',
            rol: 'ADMIN'
        });

        console.log(`Administrador creado con éxito. ID: ${id}`);
        process.exit(0);
    } catch (error) {
        console.error("Error al crear admin:", error.message);
        process.exit(1);
    }
}

crearAdmin();