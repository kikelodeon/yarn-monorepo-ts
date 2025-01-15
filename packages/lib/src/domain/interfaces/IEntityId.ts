export interface IEntityId {
  /**
   * Returns the string representation of the ID.
   * Useful for serialization and logging.
   */
  toString(): string;

  /**
   * Compares this ID with another for equality.
   * @param id - The ID to compare with.
   * @returns `true` if both IDs are equal, `false` otherwise.
   */
  equals(id: IEntityId): boolean;
}