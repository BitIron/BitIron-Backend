# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Creamos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de configuración de npm
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa la app
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["npm", "start"]
