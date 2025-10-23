-- Datos de muestra
INSERT INTO medicamentos (nombre, categoria, cantidad, fecha_expiracion) VALUES
('Paracetamol 500mg', 'Analgesico', 50, '2026-01-15'),
('Ibuprofeno 400mg', 'Antiinflamatorio', 30, '2027-06-30'),
('Amoxicilina 500mg', 'Antibiotico', 100, '2026-11-20')
ON CONFLICT (nombre) DO NOTHING;