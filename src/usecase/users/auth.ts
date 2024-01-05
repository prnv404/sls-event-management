import { prismaClient } from '@/lib/config/db.config';
import type { UserInterface } from '@/models';
import { User } from '@/models';
import { AuthService } from '@/services/auth.service';

import type { UserUsecase } from './user';

export class UserAuthUseCase {
  constructor(private readonly userUsecase: UserUsecase) {}

  async create(userDto: UserInterface) {
    const userData = new User(userDto);
    userData.password = await AuthService.hash(userData.password);
    let user = await this.userUsecase.findByEmail(userDto.email);
    if (user) {
      throw new Error('email already registerd');
    }
    user = await prismaClient.user.create({ data: userData });
    const token = await AuthService.GenerateToken(
      {
        userId: user.id,
        isVerified: false,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' },
    );
    const link = `http://localhost:4000/auth/verify-email?token=${token}`;
    await AuthService.sendMail({
      from: 'pranavofficial404@gmail.com',
      to: user.email,
      subject: 'Verify Your Email',
      text: link,
    });
    return {
      status: true,
      message: 'Please Verify your email',
      link,
    };
  }

  async verifyEmail(token: string) {
    const payload = (await AuthService.VerifyToken(
      token,
      process.env.JWT_SECRET!,
    )) as {
      userId: string;
      isVerified: string;
      email: string;
    };
    const user = await this.userUsecase.findById(payload.userId);
    if (!user) {
      throw new Error('error on Verification user not found');
    }

    const accessToken = await AuthService.GenerateToken(
      {
        userId: user.id,
        isVerified: true,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' },
    );

    const refreshToken = await AuthService.GenerateToken(
      {
        userId: user.id,
        isVerified: true,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' },
    );

    await this.userUsecase.updateUser(payload.userId, {
      isVerified: true,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async Login(email: string, password: string) {
    const user = await this.userUsecase.findByEmail(email);
    if (!user) {
      throw new Error('no user found ');
    }
    const isPasswordCorrect = await AuthService.compare(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new Error('Password incorrect');
    }

    const accessToken = await AuthService.GenerateToken(
      {
        userId: user.id,
        isVerified: true,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1m' },
    );

    const refreshToken = await AuthService.GenerateToken(
      {
        userId: user.id,
        isVerified: true,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' },
    );
    await this.userUsecase.updateUser(user.id, {
      isVerified: true,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    const user = await this.userUsecase.findById(userId);
    if (!user) {
      throw new Error('No user found');
    }
    await this.userUsecase.updateUser(
      userId,
      {
        refreshToken: null,
      },
      user.email,
    );
    return true;
  }
}
