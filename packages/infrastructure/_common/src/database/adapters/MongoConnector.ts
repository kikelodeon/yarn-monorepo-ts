// packages/infrastructure/mongo/src/MongoConnector.ts
import mongoose from 'mongoose';
import { IDatabaseConnector } from '../interfaces';

export class MongoConnector implements IDatabaseConnector {
  constructor(
    private uri: string,
    private options: mongoose.ConnectOptions = {}
  ) {}

  async connect(): Promise<void> {
    await mongoose.connect(this.uri, this.options);
    console.log(`[MongoConnector] Connected to ${this.uri}`);
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('[MongoConnector] Disconnected');
  }
}
