import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key'; // Replace with env variable

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload: Expected an object');
    }

    return decoded; // Now TypeScript knows it's a JwtPayload
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
