import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role } from '@/types';

const JWT_SECRET = process.env.AUTH_SECRET || 'careerhub_fallback_secret_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  candidateProfileId?: string;
  recruiterProfileId?: string;
  companyId?: string;
}

export function signJwtToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}
