const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  const { dni } = req.body;
  console.log("📩 DNI recibido:", dni);

  try {
    console.log("🚀 Lanzando navegador...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    console.log("🌐 Navegando a GENERNET...");
    await page.goto('https://genernet.generali.es/', { waitUntil: 'networkidle2' });

    console.log("🧭 Paso 1: Clic en Negocio");
    await page.click('a[title="Negocio"]');
    await page.waitForTimeout(500);

    console.log("🧭 Paso 2: Clic en Emisión");
    await page.click('a[title="Emisión"]');
    await page.waitForTimeout(500);

    console.log("🧭 Paso 3: Clic en Proyecto de seguro");
    await page.click('a[title="Proyecto de seguro"]');
    await page.waitForTimeout(500);

    console.log("🧭 Paso 4: Clic en Decesos");
    await page.click('a[title="Decesos"]');
    await page.waitForSelector('#dni');

    console.log("🧾 Paso 5: Introduciendo DNI...");
    await page.type('#dni', dni);

    console.log("🧾 Paso 6: Seleccionar modalidad Mixta 3.10");
    await page.click('input[value="Decesos Mixta 3.10"]');
    await page.waitForTimeout(500);

    console.log("💶 Paso 7: Seleccionando capital adicional de 1000€");
    await page.click('input[name="capitalAdicional"][value="1000"]');
    await page.waitForTimeout(500);

    console.log("📄 Paso 8: Ir a pestaña Recibos");
    await page.click('a[title="Recibos"]');
    await page.waitForSelector('input[name="periodicidad"][value="Anual"]');

    console.log("📅 Paso 9: Seleccionar pago anual");
    await page.click('input[name="periodicidad"][value="Anual"]');
    await page.waitForTimeout(500);

    console.log("📊 Paso 10: Capturar importe");
    const presupuestoText = await page.$eval('#importeAnual', el => el.textContent);
    const presupuestoAnual = parseFloat(presupuestoText.replace(/[^\d.,-]/g, '').replace(',', '.'));

    console.log("✅ Presupuesto capturado:", presupuestoAnual);

    await browser.close();
    res.json({ presupuestoAnual });

  } catch (error) {
    console.error("❌ Error en Puppeteer:", error);
    res.status(500).json({ error: 'Error al obtener presupuesto' });
  }
});

app.listen(3000, () => console.log('Servidor activo en puerto 3000 🚀'));

