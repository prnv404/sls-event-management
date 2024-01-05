import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { UserUsecase } from '@/usecase/users/user';

const userUsecase = new UserUsecase();

export class AuthService {
  public static async GenerateToken(
    payload: string | object,
    secret: string,
    options: { expiresIn: string },
  ) {
    return jwt.sign(payload, secret, options);
  }

  public static async VerifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return false;
    }
  }

  public static async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  public static async compare(password: string, hashPassword: string) {
    const isCorrect = await bcrypt.compare(password, hashPassword);
    return isCorrect;
  }

  public static async sendMail(mailOption: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'pranavofficial404@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail(mailOption);
    } catch (e) {
      console.log(e);
    }
  }

  public static async refreshAuth(refreshToken: string) {
    try {
      const payload = (await this.VerifyToken(
        refreshToken,
        process.env.JWT_SECRET!,
      )) as { id: string; email: string };
      const user = await userUsecase.findById(payload.id);
      if (user) {
        if (user.isVerified) {
          const accessToken = await this.GenerateToken(
            {
              id: user.id,
              email: user.email,
              isVerified: true,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '5m' },
          );
          return {
            accessToken,
          };
        }
        return false;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
