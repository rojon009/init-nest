import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { StringValue } from 'ms';
import { User, UserStatus } from '../users/entities/user.entity';
import { BcryptService } from './bcrypt.service';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../users/dto/user-response.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, status: UserStatus.ACTIVE },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, status: UserStatus.ACTIVE },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private generateTokens(user: User): AuthTokens {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    const jwtExpiry = (this.configService.get<string>('JWT_EXPIRY') ||
      '1h') as StringValue;
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'default-refresh-secret';
    const refreshExpiry = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRY',
    ) || '7d') as StringValue;

    const accessToken = this.jwtService.sign<JwtPayload>(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiry,
    });

    const refreshToken = this.jwtService.sign<JwtPayload>(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiry,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
