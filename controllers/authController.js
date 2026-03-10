const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Faltan datos: Usuario y contraseña son obligatorios" });
            }

            const usuario = await Usuario.buscarPorUsername(username);
            if (!usuario) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const payload = {
                id: usuario.id,
                rol: usuario.rol
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            });

            res.json({
                mensaje: "Inicio de sesión exitoso",
                token: token,
                rol: usuario.rol
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = AuthController;