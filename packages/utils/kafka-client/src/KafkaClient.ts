// packages/utils/kafka-client/src/KafkaClient.ts
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

export interface KafkaClientConfig {
  brokers: string[];
  clientId: string;
  consumerGroupId?: string;
}

export class KafkaClient {
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;

  constructor(config: KafkaClientConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      logLevel: logLevel.INFO
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: config.consumerGroupId || `${config.clientId}-group`
    });
  }

  async connect(): Promise<void> {
    await Promise.all([
      this.producer.connect(),
      this.consumer.connect()
    ]);
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.producer.disconnect(),
      this.consumer.disconnect()
    ]);
  }

  /**
   * Publishes messages to the given topic.
   * @param topic The topic to send messages to.
   * @param messages An array of messages.
   */
  async publish(topic: string, messages: { key?: string; value: string }[]): Promise<void> {
    await this.producer.send({
      topic,
      messages
    });
  }

  /**
   * Subscribes to a topic and runs the provided message handler.
   * @param topic The topic to subscribe to.
   * @param handler An async function that will process each message.
   */
  async subscribe(topic: string, handler: (message: { topic: string; partition: number; key: string | null; value: string | null }) => Promise<void>): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await handler({
          topic,
          partition,
          key: message.key?.toString() || null,
          value: message.value?.toString() || null
        });
      }
    });
  }
}
