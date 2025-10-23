import express from 'express';
import pool from "../db.js";

const router = express.Router();

// Helper: crear filtros dinámicamente
function buildWhere(query) {
    const clauses = [];
    const values = [];
    let i = 1;

    // Filtro por nombre
    if (query.nombre) {
        clauses.push(`LOWER(nombre) LIKE LOWER($${i++})`);
        values.push(`%${query.nombre}%`);
    }

    // Filtro por categoría
    if (query.categoria) {
        clauses.push(`LOWER(categoria) = LOWER($${i++})`);
        values.push(query.categoria);
    }

    // Filtro por fecha de expiración
    if (query.expira_antes) {
        clauses.push(`fecha_expiracion <= $${i++}`);
        values.push(query.expira_antes);
    }

    // Si existen filtros, se unen con AND
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` :'';
    return {where, values};
}

// CREATE
router.post('/', async (req, res, next) => {
    try {
        const { nombre, categoria, cantidad, fecha_expiracion } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !categoria || !fecha_expiracion || cantidad == null) {
            return res.status(400).json({ error: 'Campos obligatorios faltantes' });
        }

        // Validación de cantidad (entero positivo)
        const cant = parseInt(cantidad, 10);
        if (isNaN(cant) || cant <= 0) {
            return res.status(400).json({error: 'La cantidad debe ser un entero positivo'});
        }

        // Inserta el nuevo medicamento
        const result = await pool.query(
            `INSERT INTO medicamentos (nombre, categoria, cantidad, fecha_expiracion)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [nombre, categoria, cant, fecha_expiracion]
        );

        // Devuelve el registro creado
        res.status(201).json(result.rows[0]);
    } catch (err) {next(err);}
});

// READ (Se crea una lista con filtros opcionales)
router.get('/', async (req, res, next) => {
    try {
        const { where, values } = buildWhere(req.query);
        const result = await pool.query(`SELECT * FROM medicamentos ${where} ORDER BY id DESC`, values);
        res.json(result.rows);
    } catch (err) { next(err); }
});

// READ (single)
router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await pool.query(`SELECT * FROM medicamentos WHERE id = $1`, [id]);
        
        // Si no existe, devuelve un 404
        if (!result.rows.length) return res.status(404).json({ error : 'No encontrado' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, cantidad, fecha_expiracion } = req.body;


        // Validación de campos obligatorios
        if(!nombre || !categoria || !fecha_expiracion || cantidad == null) {
            return res.status(400).json({ error: 'Campos obligatorios faltantes' });
        }

        // Validación de cantidad
        const cant = parseInt(cantidad, 10); // se define 'cant'
        if (isNaN (cant) || cant <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un entero positivo' });
        }

        // Actualiza el medicamento
        const result = await pool.query(
            `UPDATE medicamentos
            SET nombre=$1, categoria=$2, cantidad=$3, fecha_expiracion=$4 
            WHERE id=$5 RETURNING *`,
            [nombre, categoria, cant, fecha_expiracion, id]
        );

        // Si no existe, devuelve un 404
        if (!result.rows.length) return res.status(404).json({ error: 'No encontrado' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

//DELETE
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM medicamentos WHERE id=$1 RETURNING id`, [id]);
        
        // Si no encontró el registro, devuelve un 404
        if(!result.rows.length) return res.status(404).json({ error: 'No encontrado' });
        res.json({ message: 'Eliminado', id: result.rows[0].id});
    } catch (err) { next(err); }
});

export default router;
