import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import medicamentosRoutes from './routes/medicamentos.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.json({ ok: true, message: 'API Gestor Medicamentos'}));

app.use('/api/medicamentos', medicamentosRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Error interno'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));