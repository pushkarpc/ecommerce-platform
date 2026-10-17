import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksDto } from './dto/tasks.dto.js';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      url: configService.getOrThrow<string>('UPSTASH_REDIS_REST_URL'),
      token: configService.getOrThrow<string>('UPSTASH_REDIS_REST_TOKEN'),
    });
  }

  getTasks(): Promise<TasksDto[] | null> {
    return this.redis.get<TasksDto[] | null>('tasks');
  }

  setTasks(tasks: TasksDto[]): Promise<TasksDto[] | 'OK' | null> {
    return this.redis.set('tasks', tasks);
  }
}
