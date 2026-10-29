import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
    private readonly jwtService: JwtService,
  ) {}

  sendOtpEmail(email: string, otp: string) {
    this.transporter.sendMail(
      {
        from: '"Local E-Commerce Test" <sandbox@yourdomain.com>',
        to: email,
        subject: 'Your One-Time Verification Code',
        text: `Your validation code is: ${otp}. It will expire in 5 minutes.`,
        html: `<b>Your validation code is: <span style="font-size: 20px;">${otp}</span></b>`,
      },
      (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      },
    );
  }

  async verifyOtp(email: string, incomingOtp: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.email = :email', { email: email });

    const getUser = await queryBuilder.getOne();
    if (!getUser) throw new NotFoundException('User not found.');
    else if (!getUser.otpCode)
      throw new UnauthorizedException({ message: 'OTP is absent.', valid: false, reason: 'absent' });
    else if (getUser.otpExpired && getUser.otpExpired.getTime() <= Date.now()) {
      throw new UnauthorizedException({ message: 'OTP is expired.', valid: false, reason: 'expired' });
    } else {
      const isMatch = await bcrypt.compare(incomingOtp, getUser.otpCode);
      if (!isMatch) throw new UnauthorizedException({ message: 'OTP is invalid.', valid: false, reason: 'invalid' });

      const queryRunner = this.dataSource.createQueryRunner();
      queryRunner.connect();
      queryRunner.startTransaction();
      try {
        const user = await queryRunner.manager.findOne(User, {
          where: { email: email },
          lock: { mode: 'pessimistic_write' },
        });
        if (!user) throw new NotFoundException('User not found.');
        else {
          const updatedUser = {
            otpCode: null,
            otpExpired: null,
            // otpExpired: new Date(user.otpExpired!.setMinutes(user.otpExpired!.getMinutes() + 1)),
          };
          Object.assign(user, updatedUser);
          await queryRunner.manager.save(User, user);
          await queryRunner.commitTransaction();

          const payload = { email, role: 'user' };
          return this.jwtService.sign(payload);
        }
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }
  }

  async findUserLogin(email: string) {
    try {
      const currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt();
      const freshHashedOtp = await bcrypt.hash(currentOtp, salt);
      this.sendOtpEmail(email, currentOtp);

      const queryRunner = this.dataSource.createQueryRunner();
      queryRunner.connect();
      queryRunner.startTransaction();
      try {
        const user = await queryRunner.manager.findOne(User, {
          where: { email: email },
          lock: { mode: 'pessimistic_write' },
        });
        if (!user) throw new NotFoundException('User not found.');
        else {
          const expirationDate = new Date();
          expirationDate.setMinutes(expirationDate.getMinutes() + 2);
          const updatedUser = {
            otpCode: freshHashedOtp,
            otpExpired: expirationDate,
            // otpExpired: new Date(user.otpExpired!.setMinutes(user.otpExpired!.getMinutes() + 1)),
          };
          Object.assign(user, updatedUser);
          await queryRunner.manager.save(User, user);
          await queryRunner.commitTransaction();
          return user;
        }
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      throw err;
    }
  }
}
