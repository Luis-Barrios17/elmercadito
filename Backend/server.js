require('dotenv').config(); // Asegúrate de cargar las variables de entorno al inicio
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/Config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const swaggerMiddleware = require('./src/middleware/swagger');

const app = express();

// Asegurarse de que se obtiene el puerto de Heroku, si no, usar 3001 para desarrollo local
const port = process.env.PORT || 3001;

// Configurar CORS
app.use(cors({
  origin: [process.env.PWA_URL, 'http://localhost:3000'], // Permitir tanto producción como local
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true, // Permitir envío de cookies/autenticación
}
)
);

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('¡Hola HikariTech API!');
});

// Integrar Swagger (asegúrate de tener bien configurado el middleware)
swaggerMiddleware(app);

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos
connectDB()
  .then(() => {
    console.log('Base de datos conectada correctamente');
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1); // Cierra el servidor si la conexión falla
  });

// Consolidar rutas
app.use('/api', routes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
}).on('error', (err) => {
  console.error('Error al iniciar el servidor:', err);
});
