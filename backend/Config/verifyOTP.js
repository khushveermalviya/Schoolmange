import speakeasy from 'speakeasy';
import sql from 'mssql';

// Function to verify OTP
export async function verifyOTP(username, token) {
  const result = await sql.query`
    SELECT two_factor_secret
    FROM Staff
    WHERE Username = ${username}
  `;

  const secret = result.recordset[0]?.two_factor_secret;

  if (!secret) {
    throw new Error('2FA not enabled for this user');
  }

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });

  return verified;
}