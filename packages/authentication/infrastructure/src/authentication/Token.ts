// packages/infrastructure-user/src/authentication/Token.ts

import jwt, { JwtPayload } from 'jsonwebtoken';
import { requireEnv } from '@kikerepo/utils-env';
import { TokenGenerationError, TokenVerificationError } from './errors';
import { AccessToken,RefreshToken} from '@kikerepo/authentication-domain';
/**
 * Interfaz extendida para el payload, asegurando la existencia de userId.
 */
export interface TokenPayload extends JwtPayload {
  userId: string;
}

// Obtenemos los secretos usando requireEnv (si falta, se lanza un error común de env)
const ACCESS_TOKEN_SECRET = requireEnv('JWT_ACCESS_SECRET');
const REFRESH_TOKEN_SECRET = requireEnv('JWT_REFRESH_SECRET');

/**
 * Genera un access token y lo envuelve en un AccessToken Value Object.
 * @param userId El ID del usuario.
 * @returns Una instancia de AccessToken.
 * @throws {TokenGenerationError} Si falla la generación.
 */
export const generateAccessToken = (userId: string): AccessToken => {
  try {
    const payload: TokenPayload = { userId };
    const tokenStr = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return new AccessToken(tokenStr);
  } catch (error) {
    throw new TokenGenerationError("Failed to generate access token");
  }
};

/**
 * Genera un refresh token y lo envuelve en un RefreshToken Value Object.
 * @param userId El ID del usuario.
 * @returns Una instancia de RefreshToken.
 * @throws {TokenGenerationError} Si falla la generación.
 */
export const generateRefreshToken = (userId: string): RefreshToken => {
  try {
    const payload: TokenPayload = { userId };
    const tokenStr = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return new RefreshToken(tokenStr);
  } catch (error) {
    throw new TokenGenerationError("Failed to generate refresh token");
  }
};

/**
 * Verifica y valida un access token, devolviendo el Value Object correspondiente.
 * @param token El token en formato string.
 * @returns Una instancia de AccessToken.
 * @throws {TokenVerificationError} Si el token es inválido o ha expirado.
 */
export const verifyAccessToken = (token: string): AccessToken => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new TokenVerificationError("Invalid access token payload: Missing userId");
    }
    // Si la validación es correcta, devolvemos el token envuelto como Value Object
    return new AccessToken(token);
  } catch (err) {
    throw new TokenVerificationError("Access token is invalid or expired");
  }
};

/**
 * Verifica y valida un refresh token, devolviendo el Value Object correspondiente.
 * @param token El token en formato string.
 * @returns Una instancia de RefreshToken.
 * @throws {TokenVerificationError} Si el token es inválido o ha expirado.
 */
export const verifyRefreshToken = (token: string): RefreshToken => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (typeof decoded !== 'object' || !('userId' in decoded)) {
      throw new TokenVerificationError("Invalid refresh token payload: Missing userId");
    }
    return new RefreshToken(token);
  } catch (err) {
    throw new TokenVerificationError("Refresh token is invalid or expired");
  }
};
