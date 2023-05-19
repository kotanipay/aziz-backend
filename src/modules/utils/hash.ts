import * as crypto from 'crypto';

export function genericHash(payload: crypto.BinaryLike, algorithm: 'md5' | 'sha256', digest: 'hex' = 'hex'): string{
  const hash = crypto.createHash(algorithm);
  hash.update(payload);
  return hash.digest(digest);
}
