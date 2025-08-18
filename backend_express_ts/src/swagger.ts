import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
// import router from "./routes/basic";

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login Stack API',
      version: '1.0.0',
      description: 'API documentation for our login stack test application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Adjust if needed
        },
      },
    },
    security: [{ BearerAuth: [] }], // Apply globally
  },
  apis: ['./src/routes/*.ts'], // Adjust the path based on your project structure
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
  // app.use(
  //   "/api-docs",
  //   swaggerUi.serve,
  //   swaggerUi.setup(swaggerDocs, {
  //     customCssUrl:
  //       "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  //   })
  // );

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // app.use("/api/v1", router); // Mount the router
  console.log('Swagger docs available at http://localhost:5000/api-docs');
};
