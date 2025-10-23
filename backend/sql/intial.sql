
CREATE TABLE IF NOT EXISTS medicamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    categoria VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad >= 0),
    fecha_expiracion DATE NOT NULL
);