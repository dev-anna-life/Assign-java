import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const ORDERS_FILE = join(__dirname, '..', 'orders.json');

app.use(cors());
app.use(express.json());

const products = JSON.parse(readFileSync(join(__dirname, '..', 'products.json'), 'utf-8'));

const orders = existsSync(ORDERS_FILE)
  ? JSON.parse(readFileSync(ORDERS_FILE, 'utf-8'))
  : [];

function saveOrders() {
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

app.get('/api/products', (_req, res) => {
  const list = products.map(p => ({
    ...p,
    priceFormatted: `$${p.price}`,
    originalPriceFormatted: p.originalPrice ? `$${p.originalPrice}` : undefined,
  }));
  res.json(list);
});

app.get('/api/orders', (_req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { items, customer, coupon, total } = req.body;
  if (!items?.length || !customer?.name || !customer?.email || !customer?.address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const order = {
    id: crypto.randomUUID(),
    items: items.map(i => ({ ...i, priceFormatted: `$${i.price}` })),
    customer,
    coupon: coupon || null,
    total: total ?? items.reduce((sum, i) => sum + i.price * i.qty, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  saveOrders();
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
