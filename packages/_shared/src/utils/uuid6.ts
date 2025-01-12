// packages/shared/src/utils/uuid.ts

import { randomBytes } from 'crypto';

/**
 * Generates a UUID v6 string.
 * Note: UUID v6 is a draft specification and may not be fully compatible with all UUID libraries.
 * This implementation follows the draft proposal to rearrange timestamp fields for better sorting.
 *
 * @returns {string} The generated UUID v6 string.
 */
export function generateUUIDv6(): string {
  // UUID epoch (October 15, 1582) to Unix epoch (January 1, 1970) in milliseconds
  const uuidEpochToUnixEpoch = 12219292800000n; // 12219292800000 milliseconds

  // Current time in milliseconds since Unix epoch
  const now = BigInt(Date.now());

  // Current time in 100-nanosecond intervals since UUID epoch
  const timestamp = (now + uuidEpochToUnixEpoch) * 10000n; // Convert ms to 100-ns

  // Split the timestamp into the three parts
  const timeLow = Number(timestamp & 0xFFFFFFFFn); // Lower 32 bits
  const timeMid = Number((timestamp >> 32n) & 0xFFFFn); // Next 16 bits
  const timeHigh = Number((timestamp >> 48n) & 0x0FFFn); // Next 12 bits

  // Set the version to 6 (0b0110)
  const timeHighAndVersion = timeHigh | (6 << 12); // 4-bit version

  // Generate a random 14-bit clock sequence
  const clockSeq = Math.floor(Math.random() * 0x3FFF); // 0 to 16383

  // Split clock sequence into high and low parts
  const clockSeqHi = (clockSeq >> 8) & 0x3F; // Upper 6 bits
  const clockSeqHiWithVariant = clockSeqHi | 0x80; // Set variant to 10xxxxxx
  const clockSeqLow = clockSeq & 0xFF; // Lower 8 bits

  // Generate a random 48-bit node (usually the MAC address; using random here)
  const node = randomBytes(6); // 6 bytes

  // Allocate a 16-byte array for the UUID
  const byteArray = Buffer.alloc(16);

  // Write time_low (4 bytes)
  byteArray.writeUInt32BE(timeLow, 0); // Bytes 0-3

  // Write time_mid (2 bytes)
  byteArray.writeUInt16BE(timeMid, 4); // Bytes 4-5

  // Write time_high_and_version (2 bytes)
  byteArray.writeUInt16BE(timeHighAndVersion, 6); // Bytes 6-7

  // Write clock_seq_hi_res (1 byte)
  byteArray.writeUInt8(clockSeqHiWithVariant, 8); // Byte 8

  // Write clock_seq_low (1 byte)
  byteArray.writeUInt8(clockSeqLow, 9); // Byte 9

  // Write node (6 bytes)
  node.copy(byteArray, 10); // Bytes 10-15

  // Convert byte array to hexadecimal string
  const hex = byteArray.toString('hex');

  // Format the UUID string as 8-4-4-4-12
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;

  return uuid;
}
