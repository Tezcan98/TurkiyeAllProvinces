# 🇹🇷 Turkey Sehirler API

Türkiye'deki şehir, ilçe ve mahalle bilgilerini harf bazlı filtreleme ile sunan basit bir API.

## 🚀 Hızlı Başlangıç

```bash
npm install express body-parser
node server.js
```

Sunucu `http://localhost:5000` adresinde çalışır.

## 📁 data.json Dosyası

Proje klasöründe bu yapıda bir `data.json` dosyası olmalı:

```json
[
  {
    "name": "İstanbul",
    "counties": [
      {
        "name": "Beşiktaş",
        "districts": [
          {
            "name": "Arnavutköy",
            "neighborhoods": [
              { "name": "Arnavutköy Mahallesi" },
              { "name": "Akatlar Mahallesi" }
            ]
          }
        ]
      }
    ]
  }
]
```

## 🔗 API Endpoints

### 🏙️ Şehirler
```http
GET /sehir/{harf}
```
**Örnek:** A harfi ile başlayan şehirler
```bash
curl http://localhost:5000/sehir/A
# ["Ankara", "Adana", "Antalya"]
```

### 🏘️ İlçeler  
```http
GET /semt/{sehir}/{harf}
```
**Örnek:** İstanbul'da B harfi ile başlayan ilçeler
```bash
curl http://localhost:5000/semt/Istanbul/B
# ["Beşiktaş", "Beyoğlu", "Bakırköy"]
```

### 🏠 Mahalleler
```http
GET /mahalle/{sehir}/{ilce}/{harf}
```
**Örnek:** İstanbul Beşiktaş'ta A harfi ile başlayan mahalleler
```bash
curl http://localhost:5000/mahalle/Istanbul/Besiktas/A
# ["Arnavutköy", "Arnavutköy Mahallesi", "Akatlar Mahallesi"]
```

## ✨ Özellikler

- 🔤 **Türkçe karakter desteği** (ç→c, ş→s, ı→i, vs.)
- 📝 **Büyük/küçük harf duyarsız**
- 📊 **JSON response**
- ⚡ **Hızlı arama**

## ⚠️ Hata Mesajları

```json
{"error": "sehir not found"}       // Şehir bulunamadı
{"error": "Sehir bulunamadi"}      // Şehir bulunamadı
{"error": "Ilce bulunamadi"}       // İlçe bulunamadı
```

## 📝 JavaScript Örneği

```javascript
fetch('http://localhost:5000/sehir/A')
  .then(response => response.json())
  .then(data => console.log(data));
```