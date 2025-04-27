#!/bin/bash
set -e

LOG_FILE="/tmp/postgres-init.log"
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

echo "⏳  Esperando a que PostgreSQL esté listo..." | tee -a "$LOG_FILE"
until pg_isready --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"; do
  sleep 1
done

echo "🛠️  Inicializando PostgreSQL con múltiples bases/usuarios..." | tee -a "$LOG_FILE"

i=1
while true; do
  DB_VAR="SERVICE_${i}_DB"
  USER_VAR="SERVICE_${i}_USER"
  PASS_VAR="SERVICE_${i}_PASSWORD"

  DB_NAME="${!DB_VAR}"
  USER_NAME="${!USER_VAR}"
  USER_PASS="${!PASS_VAR}"

  if [ -z "$DB_NAME" ]; then
    echo "🔁  No se encontró ${DB_VAR}. Finalizando." | tee -a "$LOG_FILE"
    break
  fi

  echo "📦  Configurando base '$DB_NAME' y usuario '$USER_NAME'..." | tee -a "$LOG_FILE"

  # 1) Crear la base si no existe
  if [ "$(psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")" != "1" ]; then
    echo "✅  Creando base '$DB_NAME'..." | tee -a "$LOG_FILE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE \"$DB_NAME\";" \
      >> "$LOG_FILE" 2>&1
  else
    echo "⚠️  Base '$DB_NAME' ya existe, omitiendo creación." | tee -a "$LOG_FILE"
  fi

  # 2) Crear el usuario si no existe
  if [ "$(psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$USER_NAME'")" != "1" ]; then
    echo "✅  Creando usuario '$USER_NAME'..." | tee -a "$LOG_FILE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
      -c "CREATE USER \"$USER_NAME\" WITH ENCRYPTED PASSWORD '$USER_PASS';" \
      >> "$LOG_FILE" 2>&1

    # 2a) Permitir crear bases (shadow DB)
    echo "🔐  Otorgando CREATEDB a '$USER_NAME'..." | tee -a "$LOG_FILE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
      -c "ALTER ROLE \"$USER_NAME\" CREATEDB;" \
      >> "$LOG_FILE" 2>&1
  else
    echo "⚠️  Usuario '$USER_NAME' ya existe, omitiendo creación." | tee -a "$LOG_FILE"
  fi

  # 3) Grant ALL PRIVILEGES on the database
  echo "🔧  Otorgando ALL PRIVILEGES sobre '$DB_NAME' a '$USER_NAME'..." | tee -a "$LOG_FILE"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
    -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$USER_NAME\";" \
    >> "$LOG_FILE" 2>&1

  # 4) Grant schema-level privileges
  echo "🔑  Otorgando permisos en esquema public de '$DB_NAME' a '$USER_NAME'..." | tee -a "$LOG_FILE"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-SQL >> "$LOG_FILE" 2>&1
    \\c "$DB_NAME";
    GRANT USAGE ON SCHEMA public TO "$USER_NAME";
    GRANT CREATE ON SCHEMA public TO "$USER_NAME";
SQL

  echo "✅  Configuración completada para '$DB_NAME' y '$USER_NAME'" | tee -a "$LOG_FILE"
  i=$((i + 1))
done

echo "🏁  Inicialización completa 🎉" | tee -a "$LOG_FILE"
