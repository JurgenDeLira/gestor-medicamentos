import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import medicamentosRoutes from './routes/medicamentos.js';

const app = express();

// Habilita CORS y lectura de JSON
app.use(cors());
app.use(express.json());

// Ruta base para verificar que la API esté activa
app.get('/', (_, res) => res.json({ ok: true, message: 'API Gestor Medicamentos'}));

// Rutas principales
app.use('/api/medicamentos', medicamentosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error interno'});
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));