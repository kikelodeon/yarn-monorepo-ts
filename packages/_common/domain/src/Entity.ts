// packages/shared/src/domain/entities/Entity.ts

import { CreationDate, DeletionDate } from './value-objects';
import { ValueObject } from './ValueObject';

export abstract class Entity<TId extends ValueObject<string>> {
  protected readonly _id: TId;
  protected readonly _creationDate: CreationDate;
  private _deletionDate?: DeletionDate;

  constructor(id: TId, creationDate?: CreationDate, deletionDate?: DeletionDate) {
    this._id = id;
    this._creationDate = creationDate?? new CreationDate();
    this._deletionDate = deletionDate?? undefined;
  }

  public get creationDate(): CreationDate {
    return this._creationDate;
  }

  public get id(): TId {
    return this._id;
  }

  public get deletionDate(): DeletionDate | undefined {
    return this._deletionDate;
  }

  public isDeleted(): boolean {
    return !!this._deletionDate;
  }

  
  public delete(deletionDate: DeletionDate): void {
    if (this._deletionDate) {
      throw new Error('Entity is already deleted.');
    }
    this._deletionDate = deletionDate;
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
