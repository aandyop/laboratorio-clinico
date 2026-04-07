const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    // 1. Extraer el token de varias fuentes posibles
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || (req.cookies && req.cookies.token);

    // 2. Si NO hay token
    if (!token) {
        if (req.originalUrl.includes('/api/')) {
            // Si es una petición de datos, respondemos error JSON (401)
            return res.status(401).json({ error: "Token requerido" });
        } else {
            // Si es una ruta de vista (HTML), redirigimos al login
            return res.redirect('/login');
        }
    }

    // 3. Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(403).json({ error: "Token inválido o expirado" });
            } else {
                return res.redirect('/login');
            }
        }
        req.user = user;
        next();
    });
};

const tieneRol = (rolRequerido) => {
    return (req, res, next) => {
        if (!req.user || req.user.rol !== rolRequerido) {
            return res.status(403).json({ error: "No tienes permisos para esta acción" });
        }
        next();
    };
};

module.exports = { autenticarToken, tieneRol };