const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Mock order controller
const createOrder = (req, res) => res.status(201).json({ success: true, message: 'Mock order created' });
const orderRouter = express.Router();
orderRouter.post('/', createOrder);
orderRouter.get('/ping', (req, res) => res.send('pong'));

app.use('/api/orders', orderRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found at ' + req.url }));

app.listen(5001, () => console.log('Test server running on 5001'));
