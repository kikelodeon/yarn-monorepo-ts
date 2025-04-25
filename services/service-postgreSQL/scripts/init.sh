#!/bin/bash
set -e

LOG_FILE="/tmp/postgres-init.log"
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

echo "⏳  Esperando a que PostgreSQL esté listo..." | tee -a "$LOG_FILE"

until pg_isready --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"; do
  sleep 1
done

echo "🛠️  Inicializando PostgreSQL con múltiples bases/usuarios desde variables de entorno..." | tee -a "$LOG_FILE"

i=1
while true; do
  DB_VAR="SERVICE_${i}_DB"
  USER_VAR="SERVICE_${i}_USER"
  PASS_VAR="SERVICE_${i}_PASSWORD"

  DB_NAME="${!DB_VAR}"
  USER_NAME="${!USER_VAR}"
  USER_PASS="${!PASS_VAR}"

  if [ -z "$DB_NAME" ]; then
    echo "🔁  No se encontró ${DB_VAR}. Finalizando bucle." | tee -a "$LOG_FILE"
    break
  fi

  if [ -z "$USER_NAME" ] || [ -z "$USER_PASS" ]; then
    echo "❌  ERROR: Variables incompletas para SERVICE_${i}" | tee -a "$LOG_FILE"
    echo "   Faltan: $DB_VAR=$DB_NAME, $USER_VAR=$USER_NAME, $PASS_VAR=$USER_PASS" | tee -a "$LOG_FILE"
    exit 1
  fi

  echo "📦  Verificando base '$DB_NAME' y usuario '$USER_NAME'..." | tee -a "$LOG_FILE"

  DB_EXISTS=$(psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
  USER_EXISTS=$(psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$USER_NAME'")

  if [ "$DB_EXISTS" = "1" ]; then
    echo "⚠️  La base '$DB_NAME' ya existe. Omitiendo." | tee -a "$LOG_FILE"
  else
    echo "✅  Creando base '$DB_NAME'..." | tee -a "$LOG_FILE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $DB_NAME;" >> "$LOG_FILE" 2>&1
  fi

  if [ "$USER_EXISTS" = "1" ]; then
    echo "⚠️  El usuario '$USER_NAME' ya existe. Omitiendo." | tee -a "$LOG_FILE"
  else
    echo "✅  Creando usuario '$USER_NAME'..." | tee -a "$LOG_FILE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE USER $USER_NAME WITH ENCRYPTED PASSWORD '$USER_PASS';" >> "$LOG_FILE" 2>&1
  fi

  echo "🔐  Asignando privilegios sobre '$DB_NAME' a '$USER_NAME'..." | tee -a "$LOG_FILE"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $USER_NAME;" >> "$LOG_FILE" 2>&1

  echo "✅  Completado para '$DB_NAME'" | tee -a "$LOG_FILE"
  i=$((i + 1))
done

echo "🏁  Inicialización completa 🎉" | tee -a "$LOG_FILE"
