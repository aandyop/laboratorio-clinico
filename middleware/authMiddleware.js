const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token. Inicie sesión." });
    }

    try {
        const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decodificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = decodificado;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

const tieneRol = (rolRequerido) => {
    return (req, res, next) => {
        if (req.usuario.rol !== rolRequerido) {
            return res.status(403).json({ 
                error: `Acceso denegado. Se requiere rol: ${rolRequerido}. Tu rol actual es: ${req.usuario.rol}` 
            });
        }
        next();
    };
};

module.exports = { verificarToken, tieneRol };