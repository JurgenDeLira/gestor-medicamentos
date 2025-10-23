-Gestor de Inventario de Medicamentos

Aplicación Fullstack desarrollada por Jorge De Lira, que perimite administrar medicamentos mediante operaciones CRUD (Crear, Leer, Actualizar y Eliminar), con validaciones y filtros por nombre, categoría y fecha de expiración.

-Estructura del proyecto

gestor-medicamentos/
├─ backend/
│  ├─ server.js
│  ├─ db.js
│  ├─ routes/medicamentos.js
│  ├─ package.json
│  ├─ .env.example
├─ frontend/
│  ├─ index.html
│  ├─ js/app.js
│  ├─ css/styles.css
├─ db.sql
└─ README.md

-Tecnologías utilizadas

FrontEnd: HTML5, CSS3, Bootstrap 5, jQuery.
BackEnd: Node.js, Express, Cors, dotenv, pg.
Base de datos: PostgreSQL alojada en Neon.tech (https://neon.tech) 
Despliegue: Backend → [Render]](https://render.com)  | [Netlify](https://www.netlify.com)

-Instalación y ejecución local

Clonar repositorio:
git clone https://github.com/JurgenDeLira/gestor-medicamentos.git
cd gestor-medicamentos

Instalar dependecias del backend:
cd backend
npm install



Configurar variables de entorno:
Copiar '.env.example' a '.env' y ajustar

Iniciar el servidor:
npm run dev
El backend se ejecutará en 
'http://localhost:3000/api/medicamentos'

Abrir el frontend:
En la raíz del proyecto:
Abre el archivo 'frontend/index.html' en tu navegador
(doble click o "open with live server" en VSCode)

-Configuración de la base de datos

CREATE TABLE IF NOT EXISTS medicamentos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  fecha_expiracion DATE NOT NULL
);

INSERT INTO medicamentos (nombre, categoria, cantidad, fecha_expiracion) VALUES
('Paracetamol 500mg', 'Analgesico', 50, '2026-01-15'),
('Ibuprofeno 400mg', 'Antiinflamatorio', 30, '2027-06-30'),
('Amoxicilina 500mg', 'Antibiotico', 100, '2026-11-20')
ON CONFLICT DO NOTHING;}

Verifica:
SELECT * FROM medicamentos;

-Despliegue en la nube

Backend:
El backend está desplegado y disponible públicamente en:  
'https://gestor-medicamentos.onrender.com/api/medicamentos'

Configuración:
Root Directory: `backend`
Start Command: `npm start`
Variables de entorno:

   NODE_ENV=production
   DATABASE_URL=postgres://neondb_owner:TU_PASSWORD@ep-green-thunder-ahq3wwz7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

Frontend:
El frontend está desplegado y accesible públicamente en:  
'https://brilliant-platypus-abd016.netlify.app'

configuración usada:
Se publicó la carpeta 'frontend/' en [Netlify](https://app.netlify.com/).  
En el archivo 'index.html', antes de 'app.js', se agregó la referencia al backend en Render:
   html
   <script>window.API_BASE = "https://gestor-medicamentos.onrender.com";</script>
   <script src="./js/app.js"></script>
   
Netlify genera automáticamente un dominio HTTPS.  
Si el backend se actualiza o cambia de URL, solo se reemplaza la línea de 'window.API_BASE'.

Resultado: aplicación completa funcionando en la nube con conexión entre:
Frontend: Netlify  
Backend: Render  
Base de datos: Neon (PostgreSQL)

-Endpoints del API REST

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| GET | `/api/medicamentos` | Lista todos los medicamentos |
| GET | `/api/medicamentos/:id` | Obtiene un medicamento por ID |
| POST | `/api/medicamentos` | Crea un nuevo medicamento |
| PUT | `/api/medicamentos/:id` | Actualiza un medicamento |
| DELETE | `/api/medicamentos/:id` | Elimina un medicamento |

Ejemplo (POST):
json
{
  "nombre": "Loratadina 10mg",
  "categoria": "Antihistaminico",
  "cantidad": 25,
  "fecha_expiracion": "2026-10-15"
}

-Ejemplo de uso

Crear medicamento: llena el formulario y presiona 'Guardar'.  
Editar: pulsa 'Editar' en la tabla, cambia valores y guarda.  
Eliminar: pulsa 'Eliminar' (confirmación requerida).  
Buscar y filtrar: usa los campos de búsqueda por nombre, categoría o fecha.

-Notas importantes

No subir el archivo '.env' al repositorio ('.gitignore' ya lo incluye).  
En Render, el 'sslmode=require' es obligatorio para conectarse a Neon.  
Si cambias la contraseña de Neon, actualiza 'DATABASE_URL' en Render.  
La base de datos se crea una sola vez ejecutando 'db.sql'.

-En resumen

Frontend desplegado: [https://brilliant-platypus-abd016.netlify.app](https://brilliant-platypus-abd016.netlify.app)  
Backend desplegado: [https://gestor-medicamentos.onrender.com/api/medicamentos](https://gestor-medicamentos.onrender.com/api/medicamentos)
Base de datos: En este caso se uso [Neon.tech](https://neon.tech)
CRUD funcional con validaciones y filtros
Proyecto FullStack totalmente desplegado en la nube