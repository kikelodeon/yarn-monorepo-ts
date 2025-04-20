# Usa una imagen base de Node (versión LTS recomendada)
FROM node:18-alpine

# Establece la variable de entorno para desarrollo antes de instalar dependencias
ENV NODE_ENV=development

# Directorio de trabajo en el contenedor: usamos la raíz del monorepo
WORKDIR /app

# --- CAPA DE CÓDIGO Y DEPENDENCIAS ---
# Copia todo el código del monorepo al contenedor
COPY . .

# Instala todas las dependencias (Yarn Berry instala devDependencies en modo desarrollo por defecto)
RUN yarn install

# Compila (build) todo el monorepo (esto se encargará de construir todos los paquetes, incluidos los internos)
RUN yarn build

# Establece el directorio de trabajo al servicio de autenticación
WORKDIR /app/services/service-authentication

# Expone el puerto en el que el servicio escucha (ajústalo según corresponda)
EXPOSE 5001

# Ejecuta el comando de desarrollo definido en el package.json del servicio
CMD ["yarn", "dev"]
