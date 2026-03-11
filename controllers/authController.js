const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email y contraseña son obligatorios" });
            }

            const usuario = await Usuario.buscarPorEmail(email);
            
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
            console.error("Error detallado en login:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = AuthController;