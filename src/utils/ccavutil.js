import crypto from "crypto";

export function encrypt(plainText, workingKey) {
  // Create an MD5 hash of the working key
  const m = crypto.createHash("md5");
  m.update(workingKey);
  const key = m.digest("hex"); // Get the hash as a hex string

  // Ensure the key is 16 bytes (128 bits) for AES-128
  const keyBuffer = Buffer.from(key, "hex").subarray(0, 16); // Take the first 16 bytes

  // Initialization Vector (IV) for AES-128-CBC
  const iv = Buffer.from("\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f", "binary");

  // Create the cipher
  const cipher = crypto.createCipheriv("aes-128-cbc", keyBuffer, iv);

  // Encrypt the plain text
  let encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");

  return encoded;
}

export function decrypt(encText, workingKey) {
  // Create an MD5 hash of the working key
  const m = crypto.createHash("md5");
  m.update(workingKey);
  const key = m.digest("hex"); // Get the hash as a hex string

  // Ensure the key is 16 bytes (128 bits) for AES-128
  const keyBuffer = Buffer.from(key, "hex").subarray(0, 16); // Take the first 16 bytes

  // Initialization Vector (IV) for AES-128-CBC
  const iv = Buffer.from("\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f", "binary");

  // Create the decipher
  const decipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, iv);

  // Decrypt the encrypted text
  let decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");

  return decoded;
}