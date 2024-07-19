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
app.get('/cities/:letter', (req, res) => {
    const letter = normalizeString(req.params.letter);
    const cities = data.filter(city => normalizeString(city.name).startsWith(letter));
    res.json(cities.map(city => city.name));
});

// Harfe göre ilçe seçimi
app.get('/districts/:city/:letter', (req, res) => {
    const city = normalizeString(req.params.city);
    const letter = normalizeString(req.params.letter)
    const cityData = data.find(c => normalizeString(c.name) === city);
    
    if (!cityData) {
        return res.status(404).json({ error: 'City not found' });
    }

    const districts = cityData.counties.filter(district => normalizeString(district.name).startsWith(letter));
    res.json(districts.map(district => district.name));
});


// Harfe göre mahalle seçimi
app.get('/neighborhoods/:city/:district/:letter', (req, res) => {
    const city = normalizeString(req.params.city);
    const district = normalizeString(req.params.district);
    const letter = normalizeString(req.params.letter);
    const cityData = data.find(c => normalizeString(c.name) === city);
    
    if (!cityData) {
        return res.status(404).json({ error: 'City not found' });
    }

    const districtData = cityData.counties.find(d => normalizeString(d.name) === district);

    if (!districtData) {
        return res.status(404).json({ error: 'District not found' });
    }

    const villages = districtData.districts.filter(neighborhood => normalizeString(neighborhood.name).startsWith(letter));
    const neighborhoods = districtData.districts[0].neighborhoods.filter(neighborhood => normalizeString(neighborhood.name).startsWith(letter)); 
    const allneighboor = villages.concat(neighborhoods);
    res.json(allneighboor.map(neighborhood => neighborhood.name));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
