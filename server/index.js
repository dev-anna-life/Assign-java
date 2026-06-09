import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const products = JSON.parse(readFileSync(join(__dirname, '..', 'products.json'), 'utf-8'));

app.get('/api/products', (_req, res) => {
  const list = products.map(p => ({
    ...p,
    priceFormatted: `$${p.price}`,
  }));
  res.json(list);
});

const orders = [];

app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body;
  if (!items?.length || !customer?.name || !customer?.email || !customer?.address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const order = {
    id: crypto.randomUUID(),
    items: items.map(i => ({ ...i, priceFormatted: `$${i.price}` })),
    customer,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
