import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API de gestión de tareas con proyectos y usuarios',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', minLength: 6, description: 'Contraseña' },
          },
        },
        UpdateUserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', minLength: 6, description: 'Contraseña' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', description: 'Contraseña' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token JWT' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProjectInput: {
          type: 'object',
          required: ['name', 'ownerId'],
          properties: {
            name: { type: 'string', description: 'Nombre del proyecto' },
            description: { type: 'string', description: 'Descripción del proyecto' },
            ownerId: { type: 'string', format: 'uuid', description: 'ID del usuario propietario' },
          },
        },
        UpdateProjectInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del proyecto' },
            description: { type: 'string', description: 'Descripción del proyecto' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
