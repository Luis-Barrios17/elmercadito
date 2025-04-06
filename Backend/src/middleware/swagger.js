const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../Config/swaggerOptions');

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};