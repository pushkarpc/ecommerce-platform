import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { RedisService } from './redis.service.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService, RedisService],
})
export class TasksModule {}
