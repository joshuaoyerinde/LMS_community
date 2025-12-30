import express from 'express';
import router from './router';
import cors from 'cors';

const app = express();

app.use(express.json());

// Use CORS middleware to allow cross-origin requests
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use the imported router for all API routes
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
