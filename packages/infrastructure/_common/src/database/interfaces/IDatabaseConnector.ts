// packages/infrastructure/_common/src/db/IDatabaseConnector.ts
export interface IDatabaseConnector {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }
  