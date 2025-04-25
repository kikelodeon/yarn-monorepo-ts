#!/bin/bash
set -e

echo "[init.sh] Generating server.properties..."
CONFIG_FILE="/etc/kafka/server.properties"
cat > "${CONFIG_FILE}" <<EOF
# — Broker & Controller roles
process.roles=${KAFKA_PROCESS_ROLES}
node.id=${KAFKA_NODE_ID}
controller.quorum.voters=${KAFKA_CONTROLLER_QUORUM_VOTERS}

# — Listeners
listeners=${KAFKA_LISTENERS}
advertised.listeners=${KAFKA_ADVERTISED_LISTENERS}
listener.security.protocol.map=${KAFKA_LISTENER_SECURITY_PROTOCOL_MAP}

# — Inter-broker (pick one)
inter.broker.listener.name=${KAFKA_INTER_BROKER_LISTENER_NAME}
#security.inter.broker.protocol=${KAFKA_SECURITY_INTER_BROKER_PROTOCOL}

# — Controller listener
controller.listener.names=${KAFKA_CONTROLLER_LISTENER_NAMES}

# — Storage & replication
log.dirs=${KAFKA_LOG_DIRS:-/tmp/kraft-logs}
offsets.topic.replication.factor=${KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR:-1}

# — ACLs
authorizer.class.name=kafka.security.authorizer.AclAuthorizer
super.users=User:admin

# — SASL/PLAIN
sasl.enabled.mechanisms=${KAFKA_SASL_ENABLED_MECHANISMS:-PLAIN}
sasl.mechanism.inter.broker.protocol=${KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL:-PLAIN}
sasl.mechanism.controller.protocol=${KAFKA_SASL_MECHANISM_CONTROLLER_PROTOCOL:-PLAIN}
EOF

echo "[init.sh] Generating JAAS file..."
JAAS_FILE="/etc/kafka/kafka_server_jaas.conf"
cat > "${JAAS_FILE}" <<EOF
KafkaServer {
  org.apache.kafka.common.security.plain.PlainLoginModule required
    serviceName="kafka"
    username="${KAFKA_SUPER_USER_NAME:-admin}"
    password="${KAFKA_SUPER_USER_PASS:-admin-secret}"
    user_${KAFKA_SUPER_USER_NAME:-admin}="${KAFKA_SUPER_USER_PASS:-admin-secret}"
EOF

# Add any service users: SERVICE_1_USER/PASS, SERVICE_2_USER/PASS, …
i=1
while true; do
  U="SERVICE_${i}_USER"
  P="SERVICE_${i}_PASS"
  [ -z "${!U}" ] && break
  echo "    user_${!U}=\"${!P}\"" >> "${JAAS_FILE}"
  (( i++ ))
done

cat >> "${JAAS_FILE}" <<EOF
  ;
};
EOF

# Point Kafka JVM at our JAAS file
export KAFKA_OPTS="-Djava.security.auth.login.config=${JAAS_FILE}"

# — Log4j overrides (INFO+ by default)
export KAFKA_LOG4J_ROOT_LOGLEVEL="${KAFKA_LOG4J_ROOT_LOGLEVEL:-INFO}"
export KAFKA_LOG4J_LOGGERS="${KAFKA_LOG4J_LOGGERS:-org.apache.kafka.common.network.Selector=INFO,org.apache.kafka.server.network.SocketServer=INFO,org.apache.kafka.common.security.authenticator.SaslServerAuthenticator=INFO,org.apache.kafka.controller.QuorumController=INFO}"

# Initialize storage only once
if [ ! -f "/tmp/kafka_cluster_initialized" ]; then
  echo "[init.sh] Formatting KRaft storage (cluster=${CLUSTER_ID})..."
  kafka-storage format \
    --ignore-formatted \
    --cluster-id "${CLUSTER_ID}" \
    --config "${CONFIG_FILE}"
  touch /tmp/kafka_cluster_initialized
fi

echo "[init.sh] Launching Kafka broker…"
exec /etc/confluent/docker/run
