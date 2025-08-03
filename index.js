const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Türkçe karakterleri normalize etme fonksiyonu
function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Türkçe karakterleri kaldır
        .toUpperCase();
}

// JSON dosyasını oku ve parse et - hata kontrolü ile
let data = [];
try {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
} catch (error) {
    console.error('data.json dosyası okunamadı:', error.message);
    process.exit(1);
}

// Harfe göre şehir seçimi
app.get('/sehir/:harf', (req, res) => {
    const harf = normalizeString(req.params.harf);
    const cities = data.filter(sehir => normalizeString(sehir.name).startsWith(harf));
    res.json(cities.map(sehir => sehir.name));
});

// Harfe göre ilçe seçimi
app.get('/semt/:sehir/:harf', (req, res) => {
    const sehir = normalizeString(req.params.sehir);
    const harf = normalizeString(req.params.harf);
    const sehirData = data.find(c => normalizeString(c.name) === sehir);
    
    if (!sehirData) {
        return res.status(404).json({ error: 'sehir not found' });
    }

    if (!sehirData.counties || !Array.isArray(sehirData.counties)) {
        return res.status(500).json({ error: 'invalid data structure' });
    }

    const semt = sehirData.counties.filter(semt => normalizeString(semt.name).startsWith(harf));
    res.json(semt.map(semt => semt.name));
});


// Harfe göre mahalle seçimi
app.get('/mahalle/:sehir/:ilce/:harf', (req, res) => {
    const sehir = normalizeString(req.params.sehir);
    const ilce = normalizeString(req.params.ilce);
    const harf = normalizeString(req.params.harf);
    const sehirData = data.find(c => normalizeString(c.name) === sehir);

    if (!sehirData) {
        return res.status(404).json({ error: 'Sehir bulunamadi' });
    }

    const ilceData = sehirData.counties.find(d => normalizeString(d.name) === ilce);

    if (!ilceData) {
        return res.status(404).json({ error: 'Ilce bulunamadi' });
    }

    const koyler = ilceData.districts.filter(mahalle => normalizeString(mahalle.name).startsWith(harf));
    const mahalleler = ilceData.districts[0].neighborhoods.filter(mahalle => normalizeString(mahalle.name).startsWith(harf)); 
    const tumMahalleler = koyler.concat(mahalleler);
    res.json(tumMahalleler.map(mahalle => mahalle.name));
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Turkey Cities API is running!',
        endpoints: [
            'GET /sehir/:harf',
            'GET /semt/:sehir/:harf', 
            'GET /mahalle/:sehir/:semt/:harf'
        ]
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
    console.log(`Loaded ${data.length} cities from data.json`);
});