const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.token;

    if (!token) {
        return res.status(401).redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado" });
        req.user = user;
        next();
    });
};

const tieneRol = (rolRequerido) => {
    return (req, res, next) => {
        if (req.user.rol !== rolRequerido) {
            return res.status(403).json({ error: `Acceso denegado: Se requiere rol ${rolRequerido}` });
        }
        next();
    };
};

module.exports = { autenticarToken, tieneRol };