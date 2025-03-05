import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import sql from 'mssql';

// Function to enable 2FA for an admin user
async function enable2FA(username) {
  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = secret.otpauth_url;

  // Store the secret in the database
  await sql.query`
    UPDATE Staff
    SET two_factor_secret = ${secret.base32}
    WHERE Username = ${username}
  `;

  // Generate QR code
  const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

  return qrCodeDataURL;
}