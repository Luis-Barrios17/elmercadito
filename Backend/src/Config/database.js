const mongoose = require('mongoose');
const databaseErrorHandler = require('../middleware/databaseErrorHandler');
require('dotenv').config();

const connectDB = async (app) => {
  const dbConnection = process.env.MONGODB_URI || 'mongodb://localhost:27017/HikaryTech';
  try {
    await mongoose.connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    // Aquí podrías agregar un middleware de error si es necesario
    app.use((req, res, next) => databaseErrorHandler(error, req, res, next));
    // Terminamos el proceso si no se puede conectar a la base de datos
    process.exit(1);
  }
};

module.exports = connectDB;
