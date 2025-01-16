import { generateUUIDv6, isValidUUIDv6 } from "../uuid6";

describe('isValidUUIDv6', () => {
  it('should return true for a valid UUID v6', () => {
    const validUUIDv6 = '1e79e27e-8a88-6eb6-9405-0242ac120002';
    expect(isValidUUIDv6(validUUIDv6)).toBe(true);
  });

  it('should return false for a UUID v4', () => {
    const validUUIDv4 = '550e8400-e29b-41d4-a716-446655440000'; // v4 UUID
    expect(isValidUUIDv6(validUUIDv4)).toBe(false);
  });

  it('should return false for an invalid UUID format', () => {
    const invalidUUID = 'invalid-uuid-string';
    expect(isValidUUIDv6(invalidUUID)).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidUUIDv6('')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isValidUUIDv6(null as unknown as string)).toBe(false);
    expect(isValidUUIDv6(undefined as unknown as string)).toBe(false);
  });

  it('should return false for a UUID with the wrong version', () => {
    const wrongVersionUUID = '1e79e27e-8a88-4eb6-9405-0242ac120002'; // Version 4
    expect(isValidUUIDv6(wrongVersionUUID)).toBe(false);
  });

  it('should return false for a UUID with the wrong variant', () => {
    const wrongVariantUUID = '1e79e27e-8a88-6eb6-3405-0242ac120002'; // Variant 001xxxxx
    expect(isValidUUIDv6(wrongVariantUUID)).toBe(false);
  });

  it('should handle case-insensitivity for valid UUID v6', () => {
    const upperCaseUUIDv6 = '1E79E27E-8A88-6EB6-9405-0242AC120002';
    expect(isValidUUIDv6(upperCaseUUIDv6)).toBe(true);
  });
});

describe('generateUUIDv6', () => {
  it('should generate a valid UUID v6', () => {
    const uuid = generateUUIDv6();
    expect(isValidUUIDv6(uuid)).toBe(true);
  });

  it('should generate unique UUIDs for multiple calls', () => {
    const uuidSet = new Set();
    for (let i = 0; i < 1000; i++) {
      const uuid = generateUUIDv6();
      expect(isValidUUIDv6(uuid)).toBe(true); // Ensure validity
      expect(uuidSet.has(uuid)).toBe(false); // Ensure uniqueness
      uuidSet.add(uuid);
    }
  });

  it('should contain the correct version (6)', () => {
    const uuid = generateUUIDv6();
    const version = uuid.split('-')[2][0];
    expect(version).toBe('6');
  });

  it('should contain the correct variant (10xxxxxx)', () => {
    const uuid = generateUUIDv6();
    const variant = parseInt(uuid.split('-')[3][0], 16);
    expect(variant & 0b1100).toBe(0b1000);
  });

  it('should generate UUIDs with increasing timestamps for ordering', () => {
    const uuid1 = generateUUIDv6();
    const uuid2 = generateUUIDv6();
  
    // Extract the timestamp (first 3 components of the UUID: time_low, time_mid, and time_high_and_version)
    const timestamp1 = uuid1.split('-').slice(0, 3).join('');
    const timestamp2 = uuid2.split('-').slice(0, 3).join('');
  
    expect(timestamp1 < timestamp2).toBe(true); // Ensure timestamps are increasing
  });
  
  it('should generate 16-byte UUIDs', () => {
    const uuid = generateUUIDv6();
    const byteLength = Buffer.from(uuid.replace(/-/g, ''), 'hex').length;
    expect(byteLength).toBe(16);
  });

  it('should generate 36-character UUID strings', () => {
    const uuid = generateUUIDv6();
    expect(uuid.length).toBe(36);
  });

  it('should not generate duplicate UUIDs in a high-concurrency environment', () => {
    const uuids = new Set<string>();
    const NUM_UUIDS = 100000;

    for (let i = 0; i < NUM_UUIDS; i++) {
      const uuid = generateUUIDv6();
      expect(isValidUUIDv6(uuid)).toBe(true); // Ensure validity
      expect(uuids.has(uuid)).toBe(false); // Ensure uniqueness
      uuids.add(uuid);
    }
  });
});
