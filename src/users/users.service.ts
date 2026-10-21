import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(name: string, email: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, { email: email, name: name });

      const savedUser = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllUsers() {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const queryResult = await queryBuilder.getMany();
    return queryResult;
  }

  async findUserById(id: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.andWhere('user.id = :id', { id: id });

    const user = await queryBuilder.getOne();
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: id }, lock: { mode: 'pessimistic_write' } });

      if (!user) {
        throw new NotFoundException('User not found.');
      }
      Object.assign(user, updateUserDto);

      const updatedUser = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return updatedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
