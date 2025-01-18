import { randomBytes } from 'crypto';

let lastTimestamp = BigInt(0);

/**
 * Generates a UUID v6 string.
 * UUID v6 embeds timestamps for lexicographical order.
 * @returns {string} The generated UUID v6 string.
 */
export function generateUUIDv6(): string {
  const uuidEpochToUnixEpoch = 12219292800000n; // Offset between UUID epoch (1582) and Unix epoch (1970)
  let now = BigInt(Date.now());

  // Ensure timestamps are strictly increasing
  if (now <= lastTimestamp) {
    now = lastTimestamp + 1n; // Increment the timestamp if it's the same or lower
  }
  lastTimestamp = now;

  // Convert to 100-nanosecond intervals and offset to UUID epoch
  const timestamp = (now + uuidEpochToUnixEpoch) * 10000n;

  // Split the timestamp into 3 parts
  const timeLow = Number(timestamp & 0xFFFFFFFFn); // Lower 32 bits
  const timeMid = Number((timestamp >> 32n) & 0xFFFFn); // Next 16 bits
  const timeHigh = Number((timestamp >> 48n) & 0x0FFFn); // Next 12 bits
  const timeHighAndVersion = timeHigh | 0x6000; // Set version to 6 (0b0110)

  // Generate random clock sequence and node
  const clockSeq = Math.floor(Math.random() * 0x3FFF); // Random 14-bit clock sequence
  const clockSeqHigh = (clockSeq >> 8) | 0x80; // Set variant to 10xxxxxx
  const clockSeqLow = clockSeq & 0xFF;
  const node = randomBytes(6); // Random 48-bit node

  // Construct the UUID byte array
  const uuidBytes = Buffer.alloc(16);
  uuidBytes.writeUInt32BE(timeLow, 0); // 4 bytes
  uuidBytes.writeUInt16BE(timeMid, 4); // 2 bytes
  uuidBytes.writeUInt16BE(timeHighAndVersion, 6); // 2 bytes
  uuidBytes.writeUInt8(clockSeqHigh, 8); // 1 byte
  uuidBytes.writeUInt8(clockSeqLow, 9); // 1 byte
  node.copy(uuidBytes, 10); // 6 bytes

  // Convert to string and format as 8-4-4-4-12
  const hex = uuidBytes.toString('hex');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}

/**
 * Validates if a given string is a valid UUID v6.
 *
 * @param uuid - The UUID string to validate.
 * @returns {boolean} True if the string is a valid UUID v6, false otherwise.
 */
export function isValidUUIDv6(uuid: string): boolean {
  if (!uuid) return false;

  // Regex explicitly checks for version 6 UUIDs
  const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV6Regex.test(uuid);
}