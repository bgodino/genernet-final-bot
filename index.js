const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const dni = req.body.dni;
  if (!dni) return res.status(400).send('DNI requerido');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://genernet.generali.es/');

    // Aquí iría todo el flujo paso a paso de GENERNET
    // login, navegación, simulación, selección de modalidad, capital adicional, ir a pestaña recibos, pago anual, etc.
    // Finalmente, extraer el importe total y enviarlo en la respuesta
    const precioAnual = '123,45 €'; // aquí iría el valor real obtenido de la web

    await browser.close();
    res.json({ dni, precioAnual });

  } catch (error) {
    await browser.close();
    res.status(500).send('Error en la simulación: ' + error.message);
  }
});

app.listen(3000, () => console.log('Servidor activo en puerto 3000'));

