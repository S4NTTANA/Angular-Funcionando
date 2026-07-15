const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data2.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) return console.error(err);
  console.log('TABELAS:', tables);

  tables.forEach(t => {
    db.all(`PRAGMA table_info(${t.name})`, (err, cols) => {
      if (err) return console.error(err);
      console.log(`\nCOLUNAS de ${t.name}:`, cols.map(c => c.name));

      db.all(`SELECT * FROM ${t.name} LIMIT 2`, (err, rows) => {
        if (err) return console.error(err);
        console.log(`AMOSTRA de ${t.name}:`, JSON.stringify(rows, null, 2));
      });
    });
  });
});