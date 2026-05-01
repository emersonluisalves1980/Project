const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    img: 'https://picsum.photos/300?1',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 49.99,
    img: 'https://picsum.photos/300?2',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 19.99,
    img: 'https://picsum.photos/300?3',
  },
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
