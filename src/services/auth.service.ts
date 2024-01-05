import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export class AuthService {
  public static async GenerateToken(
    payload: string | object,
    secret: string,
    options: { expiresIn: string }
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
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "pranavofficial404@gmail.com",
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail(mailOption);
    } catch (e) {
      console.log(e);
    }
  }
}
