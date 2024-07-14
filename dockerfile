# Temel imaj olarak Node.js kullan
FROM node:14

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Gerekli paketleri yükle
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Uygulamayı dinleyeceği portu belirt
EXPOSE 5000

# Uygulamayı başlat
CMD ["node", "index.js"]
