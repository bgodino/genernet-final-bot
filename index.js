const express = require('express');
const app = express();
app.use(express.json());

app.post('/', (req, res) => {
  const { dni } = req.body;
  console.log('DNI recibido:', dni);

  // Aquí iría tu lógica de Puppeteer
  res.json({ presupuestoAnual: 123.45 }); // ejemplo de respuesta simulada
});

app.listen(3000, () => console.log('Servidor activo en puerto 3000'));
