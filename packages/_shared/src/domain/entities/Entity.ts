// packages/shared/src/domain/entities/Entity.ts

import { ValueObject } from '../valueObjects/ValueObject';

export abstract class Entity<TId extends ValueObject<string>> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  public get id(): TId {
    return this._id;
  }

  public equals(entity?: Entity<TId>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (entity === this) {
      return true;
    }

    if (entity.constructor !== this.constructor) {
      return false;
    }

    return this.id.equals(entity.id);
  }
}
