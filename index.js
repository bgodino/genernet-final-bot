const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors()); // 🔓 Habilita CORS
app.use(express.json()); // 🧠 Permite leer JSON en las peticiones POST

app.post('/', async (req, res) => {
  const { dni } = req.body;
  console.log('DNI recibido:', dni);

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto('https://genernet.generali.es/', { waitUntil: 'networkidle2' });

    // Paso 1: Navegar a Decesos
    await page.click('a[title="Negocio"]');
    await page.waitForTimeout(500);
    await page.click('a[title="Emisión"]');
    await page.waitForTimeout(500);
    await page.click('a[title="Proyecto de seguro"]');
    await page.waitForTimeout(500);
    await page.click('a[title="Decesos"]');
    await page.waitForSelector('#dni');

    // Paso 2: Introducir DNI
    await page.type('#dni', dni);

    // Paso 3: Modalidad Mixta 3.10
    await page.click('input[value="Decesos Mixta 3.10"]');
    await page.waitForTimeout(500);

    // Paso 4: Capital adicional 1000 €
    await page.click('input[name="capitalAdicional"][value="1000"]');
    await page.waitForTimeout(500);

    // Paso 5: Ir a pestaña Recibos
    await page.click('a[title="Recibos"]');
    await page.waitForSelector('input[name="periodicidad"][value="Anual"]');

    // Paso 6: Seleccionar pago anual
    await page.click('input[name="periodicidad"][value="Anual"]');
    await page.waitForTimeout(500);

    // Paso 7: Capturar importe
    const presupuestoText = await page.$eval('#importeAnual', el => el.textContent);
    const presupuestoAnual = parseFloat(presupuestoText.replace(/[^\d.,-]/g, '').replace(',', '.'));

    await browser.close();
    res.json({ presupuestoAnual });
  } catch (error) {
    console.error('Error en Puppeteer:', error);
    res.status(500).json({ error: 'Error al obtener presupuesto' });
  }
});

app.listen(3000, () => console.log('Servidor activo en puerto 3000'));
