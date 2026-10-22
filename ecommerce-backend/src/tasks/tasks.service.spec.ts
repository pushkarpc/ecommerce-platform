import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { RedisService } from './redis.service.js';
import { jest } from '@jest/globals';
import { TasksDto } from './dto/tasks.dto.js';
import { TestData } from './test-data.js';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let storedTasks: TasksDto[] = structuredClone(new TestData().testData);
  let taskService: TasksService;
  let redisService: RedisService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: RedisService,
          useValue: {
            getTasks: jest.fn<() => Promise<TasksDto[]>>().mockImplementation(async () => structuredClone(storedTasks)),
            setTasks: jest
              .fn<(tasks: TasksDto[]) => Promise<TasksDto[]>>()
              .mockImplementation(async (tasks: TasksDto[]) => (storedTasks = structuredClone(tasks))),
          },
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should fetch tasks on file loading', async () => {
    await taskService.initTasks();

    const result = await taskService.findAll();

    expect(redisService.getTasks).toHaveBeenCalled();
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual(storedTasks);
  });

  it('should return only completed tasks', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll('true', undefined, undefined, undefined, 1, 10);

    expect(result).toHaveLength(1);
    expect(result.every((task) => task.completed)).toStrictEqual(true);
  });

  it('should return only tasks matching search term', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll(undefined, 'rest', undefined, undefined, 1, 10);

    expect(result).toHaveLength(2);
    expect(
      result.every(
        (task) => task.title.toLowerCase().includes('rest') || (task.description ?? '').toLowerCase().includes('rest'),
      ),
    ).toBe(true);
  });

  it('should return only tasks sorted by title asc', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll(undefined, undefined, 'title', undefined, 1, 10);

    expect(result).toHaveLength(3);
    expect(result[0].title.toLowerCase().includes('nestjs')).toBe(true);
  });

  it('should return only tasks sorted by title desc', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll(undefined, undefined, 'title', 'desc', 1, 10);

    expect(result).toHaveLength(3);
    expect(result[0].title.toLowerCase().includes('upstash')).toBe(true);
  });

  it('should return only tasks sorted by title desc limited by 1 row', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll(undefined, undefined, 'title', 'desc', 1, 1);

    expect(result).toHaveLength(1);
  });

  it('should return only tasks sorted by title desc limited by 2 rows', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll(undefined, undefined, 'title', 'desc', 1, 2);

    expect(result).toHaveLength(2);
  });

  it('should return only tasks matching all filters', async () => {
    await taskService.initTasks();
    const result = await taskService.findAll('true', 'apis', 'title', 'desc', 1, 2);

    expect(result).toHaveLength(1);
    expect(result.every((task) => task.title.toLowerCase().includes('apis') && task.completed === true)).toBe(true);
  });

  it('should return the newly created task', async () => {
    await taskService.initTasks();
    const newTask = { title: 'test task', description: 'dummy task', completed: false };
    const result = await taskService.create(newTask);

    expect(result).toBeDefined();
    expect(result.id === 4).toBeTruthy();
    expect(result.title.toLowerCase().includes('test task')).toBeTruthy();
    expect(result.title.toLowerCase().includes('z')).toBeFalsy();
    expect(result.description.toLowerCase().includes('dummy task')).toBeTruthy();
    expect(result.completed === false).toBeTruthy();
    expect(redisService.setTasks).toHaveBeenCalled();

    const redisTasks = await redisService.getTasks();
    expect(redisTasks).toHaveLength(4);
  });

  it('should return the specific task by id', async () => {
    await taskService.initTasks();
    const result = taskService.findOne(3);

    expect(result).toBeDefined();
    expect(result.id === 3).toBeTruthy();
  });

  it('should throw NotFoundException for a non-existing task id', async () => {
    await taskService.initTasks();

    expect(() => taskService.findOne(5)).toThrow(NotFoundException);
  });

  it('should update the specific task by id', async () => {
    await taskService.initTasks();
    const updateTask = { title: 'test task updated', completed: true };
    const result = await taskService.update(4, updateTask);

    expect(redisService.setTasks).toHaveBeenCalled();
    expect(result.completed === true).toBeTruthy();
    expect(result.title).toStrictEqual('test task updated');
  });

  it('should delete the specific task by id', async () => {
    await taskService.initTasks();

    expect(await redisService.getTasks()).toHaveLength(4);

    const result = await taskService.remove(4);

    expect(redisService.setTasks).toHaveBeenCalled();
    expect(await redisService.getTasks()).toHaveLength(3);
    expect(result.id === 4).toBeTruthy();
  });
});
