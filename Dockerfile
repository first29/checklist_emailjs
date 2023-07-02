# Configuración de la imagen base para la aplicación de React
FROM node:latest as build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de la aplicación de React
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos de la aplicación de React
COPY . .

# Construir la aplicación de React
RUN npm run build

# Configuración de la imagen base para el servidor web
FROM nginx:latest

# Copiar los archivos de la aplicación de React construida al servidor web
COPY --from=build /app/build /usr/share/nginx/html

# Puerto en el que el servidor web escucha
EXPOSE 80

# Comando para iniciar el servidor web
CMD ["nginx", "-g", "daemon off;"]
