import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { User } from './users/entities/user.entity.js';

const otp = Math.floor(100000 + Math.random() * 900000).toString();

const salt = await bcrypt.genSalt();
const hashedOtp = await bcrypt.hash(otp, salt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findUserLogin(email: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.email = :email', { email: email });

    const getUser = await queryBuilder.getOne();
    if (!getUser) throw new NotFoundException('User not found.');
    else if (!getUser.otpCode)
      throw new UnauthorizedException({ message: 'OTP is absent.', valid: false, reason: 'absent' });
    else if (getUser.otpExpired && getUser.otpExpired.getTime() <= Date.now()) {
      throw new UnauthorizedException({ message: 'OTP is expired.', valid: false, reason: 'expired' });
    }
    // const queryRunner = this.dataSource.createQueryRunner();

    // queryRunner.connect();
    // queryRunner.startTransaction();
    // try {
    //   const user = await queryRunner.manager.findOne(User, {
    //     where: { email: email },
    //     lock: { mode: 'pessimistic_write' },
    //   });

    //   if (!user) throw new NotFoundException('User not found.');
    //   else {
    //     const updatedUser = {
    //       otpCode: hashedOtp,
    //       // otpExpired: new Date(),
    //       // otpExpired: new Date(user.otpExpired!.setMinutes(user.otpExpired!.getMinutes() + 1)),
    //     };
    //     Object.assign(user, updatedUser);

    //     await queryRunner.manager.save(User, user);
    //     await queryRunner.commitTransaction();

    //     return user;
    //   }
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    //   throw err;
    // } finally {
    //   await queryRunner.release();
    // }
  }
}
