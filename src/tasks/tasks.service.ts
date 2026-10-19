import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TasksDto } from './dto/tasks.dto.js';
import { TestData } from './test-data.js';
import { RedisService } from './redis.service.js';

@Injectable()
export class TasksService {
  private tasks: TasksDto[] = [];
  testData: TestData;

  constructor(private redisService: RedisService) {}

  async onModuleInit() {
    await this.initTasks();
  }

  async initTasks() {
    //fetch tasks from Upstash Redis database
    try {
      const redisTasks = await this.redisService.getTasks();

      if (!redisTasks) {
        throw new NotFoundException(`Task with key 'tasks' not found.`);
      } else {
        this.tasks = redisTasks;
      }
    } catch (error) {
      throw error;
    }
    // this.tasks = this.testData.testData;
  }

  async findAll(
    completed?: string,
    search?: string,
    sortBy?: string,
    order?: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<TasksDto[]> {
    let result = [...this.tasks];
    //filter by completion status
    if (completed === 'true') {
      result = result.filter((item) => item.completed === true);
    }
    if (completed === 'false') {
      result = result.filter((item) => item.completed === false);
    }

    //filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();

      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) || (item.description ?? '').toLowerCase().includes(searchTerm),
      );
    }

    //sort by title or id
    if (sortBy === 'title' || sortBy === 'id') {
      result.sort((a, b) => {
        let comparison: number;

        if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else {
          comparison = a.id - b.id;
        }

        return order === 'desc' ? -comparison : comparison;
      });
    }
    const startIndex = (page - 1) * limit;
    return result.slice(startIndex, startIndex + limit);
  }

  async create(taskData: CreateTaskDto) {
    //create a new task and save it to database
    const newTask: TasksDto = {
      id: Math.max(0, ...this.tasks.map((task) => task.id)) + 1,
      title: taskData.title,
      description: taskData.description ?? '',
      completed: taskData.completed ?? false,
    };
    this.tasks.push(newTask);
    await this.redisService.setTasks(this.tasks);

    return newTask;
  }

  findOne(id: number) {
    //find task by id
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  async update(id: number, updateData: UpdateTaskDto) {
    //update a task field
    const task = this.findOne(id);

    Object.assign(task, updateData);
    await this.redisService.setTasks(this.tasks);
    return task;
  }

  async remove(id: number) {
    //delete a task
    const task = this.findOne(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
    await this.redisService.setTasks(this.tasks);
    return task;
  }
}
