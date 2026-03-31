import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from './config.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Auth API Reference',
            version: '1.0.0',
            description: 'A robust and secure authentication API built with Node.js, Express, and MongoDB. Includes seamless Multi-Device Session tracking via Bearer JWTs and HTTP-Only Browser cookies.',
        },
        servers: [
            {
                url: `http://localhost:${PORT || 7511}`,
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                // Defines the Bearer Token UI
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Inject your short-lived "access_token" to immediately unlock protected routes.',
                },
                // Defines the specific HTTP-only cookie interface
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refresh_token',
                    description: 'The HTTP-Only cookie abstracting your secure long-lived refresh token.',
                }
            },
        },
    },
    // Identifies what actual backend route files hold the Swagger inline comments
    apis: ['./routes/*.routes.js'], 
};

// Generates the native JSON config specification
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
