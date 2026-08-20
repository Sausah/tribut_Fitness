const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'connected' });
});

// GET all product variations
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
    res.json(rows);
  });
});

// GET all orders (Admin route)
app.get('/api/orders', (req, res) => {
  const sql = `
    SELECT o.*, 
           json_group_array(
             json_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', p.name,
               'quantity', oi.quantity,
               'price', oi.price
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve orders' });
    }
    // Parse JSON string array of items
    const formattedRows = rows.map(row => {
      try {
        row.items = JSON.parse(row.items);
        // If there's an item but product_id is null, it means there are no items
        if (row.items.length === 1 && row.items[0].product_id === null) {
          row.items = [];
        }
      } catch (e) {
        row.items = [];
      }
      return row;
    });
    res.json(formattedRows);
  });
});

// POST placing a new order
app.post('/api/orders', (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    city,
    state,
    postal_code,
    items, // Array of { product_id, quantity }
  } = req.body;

  if (!customer_name || !customer_email || !customer_phone || !shipping_address || !city || !state || !postal_code || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  // Calculate total price based on product list
  db.all('SELECT id, price, stock FROM products', [], (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database check failed' });
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    let total_amount = 0;
    const itemsToInsert = [];

    for (const item of items) {
      const prod = productMap.get(item.product_id);
      if (!prod) {
        return res.status(404).json({ error: `Product ID ${item.product_id} not found` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product: ${prod.name}` });
      }
      total_amount += prod.price * item.quantity;
      itemsToInsert.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: prod.price,
      });
    }

    // Insert order inside serialized db transaction to ensure integrity
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const orderSql = `
        INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, city, state, postal_code, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        orderSql,
        [customer_name, customer_email, customer_phone, shipping_address, city, state, postal_code, total_amount],
        function (err) {
          if (err) {
            console.error(err);
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to place order' });
          }

          const orderId = this.lastID;
          const itemSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
          `;

          const updateStockSql = `
            UPDATE products SET stock = stock - ? WHERE id = ?
          `;

          let insertedCount = 0;
          let hasError = false;

          itemsToInsert.forEach((item) => {
            db.run(itemSql, [orderId, item.product_id, item.quantity, item.price], (err) => {
              if (err && !hasError) {
                console.error(err);
                hasError = true;
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to record order item' });
              }

              db.run(updateStockSql, [item.quantity, item.product_id], (err) => {
                if (err && !hasError) {
                  console.error(err);
                  hasError = true;
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Failed to update product stock' });
                }

                insertedCount++;
                if (insertedCount === itemsToInsert.length && !hasError) {
                  db.run('COMMIT');
                  res.status(201).json({
                    message: 'Order placed successfully',
                    orderId,
                    total_amount,
                  });
                }
              });
            });
          });
        }
      );
    });
  });
});

// POST submit a contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, message], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.json({ message: 'Message sent successfully', id: this.lastID });
  });
});

// GET all contact messages (Admin route)
app.get('/api/contact', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
    res.json(rows);
  });
});

// POST submit a question to the expert
app.post('/api/expert-questions', (req, res) => {
  const { name, email, question } = req.body;

  if (!email || !question) {
    return res.status(400).json({ error: 'Email and question are required' });
  }

  const sql = `INSERT INTO expert_questions (name, email, question) VALUES (?, ?, ?)`;
  db.run(sql, [name || 'Anonymous', email, question], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to submit expert question' });
    }
    res.status(201).json({ message: 'Question submitted successfully', id: this.lastID });
  });
});

// GET all expert questions
app.get('/api/expert-questions', (req, res) => {
  db.all('SELECT * FROM expert_questions ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve expert questions' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
