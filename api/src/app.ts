import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

const app = express();
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',        // React development server
    'http://localhost:3001',        // Alternative React port
    'http://127.0.0.1:3000',        // Localhost alternative
    'http://127.0.0.1:3001',
    'http://125.18.84.110:3000',       // Another device IP
    'http://10.115.43.116:3000',       // Your device IP
    'http://10.115.43.116:3001'        // Your device IP alternative port
    // Add your production frontend URLs here
    // 'https://yourdomain.com',
    // 'https://www.yourdomain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
