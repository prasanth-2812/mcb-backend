import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MCB REST API',
      version: '1.0.0',
      description: 'Jobs, Users, Candidates API',
    },
    servers: [
      { url: 'http://localhost:4000' },
    ],
  },
  // Parse JSDoc in route files for endpoint schemas
  apis: ['src/routes/*.ts','src/docs/**/*.ts'],
});
