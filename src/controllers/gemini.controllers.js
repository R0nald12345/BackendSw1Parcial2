const dotenv = require('dotenv');
const { resolve } = require('path');

// Importación compatible de node-fetch para CommonJS (v3+)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// En CommonJS, __dirname y __filename ya existen
// No necesitas definirlos

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("🔑 Variables de entorno cargadas:", {
  env: process.env.NODE_ENV,
  geminiKey: process.env.GEMINI_API_KEY ? 'Configurada' : 'No configurada',
  envPath: resolve(__dirname, '..', '.env')
});

const generarContenidoGemini = async (req, res) => {
  try {
    if (!API_KEY) {
      console.error("❌ API_KEY no encontrada");
      return res.status(500).json({ 
        error: "API_KEY no configurada",
        envVars: {
          exists: !!process.env.GEMINI_API_KEY,
          type: typeof process.env.GEMINI_API_KEY
        }
      });
    }

    console.log("🔥 REQUEST RECIBIDO:");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body, null, 2));

    let { contents, image } = req.body;

    if (!contents) {
      console.log("❌ No se encontró 'contents' en el body");
      return res.status(400).json({ error: "Falta el campo 'contents'" });
    }

    if (!Array.isArray(contents)) {
      console.log("❌ 'contents' no es un array:", typeof contents);
      return res.status(400).json({ error: "El campo 'contents' debe ser un array" });
    }

    if (contents.length === 0) {
      console.log("❌ Array 'contents' está vacío");
      return res.status(400).json({ error: "El array 'contents' no puede estar vacío" });
    }

    if (image) {
      contents[0].parts.push({
        inlineData: {
          mimeType: "image/png",
          data: image
        }
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const payload = { contents };
    console.log("🚀 Enviando a Gemini:", JSON.stringify(payload, null, 2));

    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'node-fetch/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log("📡 Status de respuesta:", respuesta.status);
    console.log("📡 Headers de respuesta:", respuesta.headers.raw());

    const text = await respuesta.text();
    console.log("🔍 Respuesta cruda de Gemini:", text);

    if (!respuesta.ok) {
      console.log("❌ Error HTTP:", respuesta.status);
      return res.status(respuesta.status).json({ 
        error: `Error HTTP ${respuesta.status}`, 
        raw: text 
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log("❌ Error parseando JSON:", e.message);
      return res.status(500).json({ 
        error: "Respuesta no es JSON válido", 
        raw: text,
        parseError: e.message 
      });
    }

    if (!data || !data.candidates) {
      console.log("❌ Estructura de respuesta inválida:", data);
      return res.status(500).json({ 
        error: "Respuesta vacía de Gemini", 
        raw: data 
      });
    }

    console.log("✅ Respuesta exitosa, enviando al cliente");
    res.json(data);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generarContenidoGemini };