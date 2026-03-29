const db = require('../config/db');

class Resultado {
    static async registrar(datos) {
        const { orden_id, examen_id, valor_obtenido, fuera_de_rango } = datos;
        const [result] = await db.query(
            'INSERT INTO resultados (orden_id, examen_id, valor_obtenido, fuera_de_rango) VALUES (?, ?, ?, ?)',
            [orden_id, examen_id, valor_obtenido, fuera_de_rango]
        );
        return result;
    }
}
module.exports = Resultado;