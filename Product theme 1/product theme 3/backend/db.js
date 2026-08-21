const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database schema
db.serialize(() => {
  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      stock INTEGER DEFAULT 100,
      savings_text TEXT
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Order items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Expert Questions table
  db.run(`
    CREATE TABLE IF NOT EXISTS expert_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default product variations if products table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error('Error checking products count:', err.message);
      return;
    }
    if (row.count === 0) {
      console.log('Seeding default Tribu-Fit packages...');
      const insertStmt = db.prepare(`
        INSERT INTO products (name, tagline, description, price, image_url, stock, savings_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        'Tribu-Fit Single Bottle',
        'Perfect for trying it out',
        '1x Tribu-Fit (60 Capsules). A powerful blend of Tribulus and Ashwagandha to kickstart your fitness journey.',
        999,
        '/assets/tribu-fit-bottle.png',
        150,
        ''
      );

      insertStmt.run(
        'Tribu-Fit Double Pack',
        'Recommended Start Pack',
        '2x Tribu-Fit (120 Capsules total). Boost stamina, energy levels, and speed up post-workout recovery.',
        1799,
        '/assets/tribu-fit-bottle.png',
        200,
        'Save 15%'
      );

      insertStmt.run(
        'Tribu-Fit Triple Value Pack',
        'Best Value & Results',
        '3x Tribu-Fit (180 Capsules total). The ultimate package for sustained muscle building, energy, and stress relief.',
        2499,
        '/assets/tribu-fit-bottle.png',
        300,
        'Save 22%'
      );

      insertStmt.finalize(() => {
        console.log('Seeding complete.');
      });
    }
  });

  // Seed default expert questions if table is empty
  db.get("SELECT COUNT(*) as count FROM expert_questions", (err, row) => {
    if (err) {
      console.error('Error checking expert questions count:', err.message);
      return;
    }
    if (row.count === 0) {
      console.log('Seeding default Tribu-Fit expert questions...');
      const insertStmt = db.prepare(`
        INSERT INTO expert_questions (name, email, question, answer)
        VALUES (?, ?, ?, ?)
      `);

      insertStmt.run(
        'Amit Patel',
        'amit@example.com',
        'I have a history of high blood pressure. Is it safe for me to take Tribu-Fit daily?',
        'Tribu-Fit is formulated with natural adaptogens like Ashwagandha, which can help support stress management, but Tribulus can increase blood flow. We recommend consulting your cardiologist before introducing any supplement if you have pre-existing cardiovascular conditions.'
      );

      insertStmt.run(
        'Rajesh K.',
        'rajesh@example.com',
        'Can I combine Tribu-Fit with whey protein and creatine post-workout?',
        'Yes, Tribu-Fit works synergistically with protein and creatine. While whey and creatine support muscle repair and phosphate replenishment, Tribu-Fit supports hormonal homeostasis and recovery adaptively. It is perfectly safe to stack them.'
      );

      insertStmt.run(
        'Vikram Sen',
        'vikram@example.com',
        'I am concern that it contains heavy metals. Does your product get tested for toxicity?',
        'Absolutely. Every batch of Tribu-Fit undergoes strict third-party heavy metal, microbial, and purity testing. We adhere strictly to FSSAI guidelines and GMP protocols to ensure no contaminants are present.'
      );

      insertStmt.finalize(() => {
        console.log('Expert questions seeding complete.');
      });
    }
  });
});

module.exports = db;
