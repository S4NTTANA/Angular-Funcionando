const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(path.join(__dirname, '..', 'data2.db'));

app.use(cors());
app.use(bodyParser.json());

// LOGIN
app.post('/login', (req, res) => {
  const { user_name, user_password } = req.body;

  if (!user_name || !user_password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM user WHERE user_name = ? AND user_password = ?',
    [user_name, user_password],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'Erro no servidor' });
      if (!row) return res.status(401).json({ message: 'Usuário ou senha inválidos' });

      res.json({
        id: row.user_id,
        nome: row.user_full_name,
        email: row.user_email
      });
    }
  );
});

// LISTA DE VEÍCULOS (cartão de busca por modelo)
app.get('/vehicle', (req, res) => {
  db.all('SELECT * FROM VEHICLE', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });

    const vehicles = rows.map(r => ({
      id: r.vehicle_id,
      vehicle: r.vehicle_model,
      volumetotal: r.vehicle_volumetotal,
      connected: r.vehicle_connected,
      softwareUpdates: r.vehicle_softwareUpdates
    }));

    res.json({ vehicles });
  });
});

// DADOS DETALHADOS DO VEÍCULO (tabela com busca por código/VIN)
app.get('/vehicleData', (req, res) => {
  const { vin } = req.query;
  let sql = 'SELECT * FROM VEHICLEDATA';
  const params = [];

  if (vin) {
    sql += ' WHERE vehicledata_vin = ?';
    params.push(vin);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });

    const vehicleData = rows.map(r => ({
      vin: r.vehicledata_vin,
      odometer: r.vehicledata_odometer,
      fuelLevel: r.vehicledata_fuelLevel,
      status: r.vehicledata_status,
      lat: r.vehicledata_lat,
      long: r.vehicledata_long
    }));

    res.json({ vehicleData });
  });
});

module.exports = app;