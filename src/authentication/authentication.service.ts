import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  APP_SECRET,
  ENCRYPTION_SECRET_KEY,
} from '../@common/environment-contants';
import { AES, enc, mode, lib, pad } from 'crypto-js';

export type DecryptedTokenData = {
  email: string;
  id: string;
  isAdmin?: boolean;
};

@Injectable()
export class AuthenticationService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 8);
  }

  async validatePassword(
    password: string,
    userSavedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userSavedPassword);
  }

  encryptToken(
    email: string,
    password: string,
    id: number,
    isAdmin: boolean,
  ): string {
    return jwt.sign({ email, password, id, isAdmin }, APP_SECRET as string, {
      expiresIn: '1d',
    });
  }

  static verifyEncryptedToken(authorization: string): DecryptedTokenData {
    const [, token] = authorization.split(' ');

    const { email, id, isAdmin } = jwt.verify(
      token,
      APP_SECRET as string,
    ) as DecryptedTokenData;

    return { email, id, isAdmin };
  }

  static decrypt(encryptedData: string) {
    const key = enc.Utf8.parse(ENCRYPTION_SECRET_KEY);
    const iv = enc.Utf8.parse(ENCRYPTION_SECRET_KEY);

    const encryptedBytes = enc.Hex.parse(encryptedData);

    const encrypted = lib.CipherParams.create({
      ciphertext: encryptedBytes,
    });

    const decrypted = AES.decrypt(encrypted, key, {
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });

    return decrypted.toString(enc.Utf8);
  }

  static encrypt(data: string) {
    const key = enc.Utf8.parse(ENCRYPTION_SECRET_KEY);
    const iv = enc.Utf8.parse(ENCRYPTION_SECRET_KEY);

    const encrypted = AES.encrypt(data, key, {
      iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });

    return encrypted.ciphertext.toString(enc.Hex);
  }
}
