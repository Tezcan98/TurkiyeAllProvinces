const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Türkçe karakterleri normalize etme fonksiyonu
function normalizeString(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Türkçe karakterleri kaldır
        .toUpperCase();
}

// JSON dosyasını oku ve parse et
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Harfe göre il seçimi
app.get('/cities/:harf', (req, res) => {
    const harf = normalizeString(req.params.harf);
    const cities = data.filter(sehir => normalizeString(sehir.name).startsWith(harf));
    res.json(cities.map(sehir => sehir.name));
});

// Harfe göre ilçe seçimi
app.get('/semt/:sehir/:harf', (req, res) => {
    const sehir = normalizeString(req.params.sehir);
    const harf = normalizeString(req.params.harf)
    const sehirData = data.find(c => normalizeString(c.name) === sehir);
    
    if (!sehirData) {
        return res.status(404).json({ error: 'sehir not found' });
    }

    const semt = sehirData.counties.filter(semt => normalizeString(semt.name).startsWith(harf));
    res.json(semt.map(semt => semt.name));
});


// Harfe göre mahalle seçimi
app.get('/mahalle/:sehir/:semt/:harf', (req, res) => {
    const sehir = normalizeString(req.params.sehir);
    const semt = normalizeString(req.params.semt);
    const harf = normalizeString(req.params.harf);
    const sehirData = data.find(c => normalizeString(c.name) === sehir);
    
    if (!sehirData) {
        return res.status(404).json({ error: 'sehir not found' });
    }

    const semtData = sehirData.counties.find(d => normalizeString(d.name) === semt);

    if (!semtData) {
        return res.status(404).json({ error: 'semt not found' });
    }

    const köy = semtData.semt.filter(mahalle => normalizeString(mahalle.name).startsWith(harf));
    const mahalle = semtData.semt[0].mahalle.filter(mahalle => normalizeString(mahalle.name).startsWith(harf)); 
    const allneighboor = köy.concat(mahalle);
    res.json(allneighboor.map(mahalle => mahalle.name));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
