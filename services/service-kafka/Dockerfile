FROM confluentinc/cp-kafka:7.6.0

USER root

# 👇 This is where Confluent looks for init scripts!
COPY ./scripts/init.sh /etc/confluent/docker/init.sh

RUN chmod +x /etc/confluent/docker/init.sh
