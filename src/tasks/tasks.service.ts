import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto.js';

type CreateTaskInput = {
  title: string;
  description?: string;
  completed?: boolean;
};

@Injectable()
export class TasksService {
  private tasks = [
    {
      id: 1,
      title: 'Learn Nestjs',
      description: 'Build my first REST API',
      completed: false,
    },
    {
      id: 2,
      title: 'Learn REST APIs',
      description: 'Understand HTTP methods',
      completed: true,
    },
  ];

  findAll(
    completed?: string,
    search?: string,
    sortBy?: string,
    order?: string,
  ) {
    let result = [...this.tasks];
    if (completed === 'true') {
      result = result.filter((item) => item.completed === true);
    }
    if (completed === 'false') {
      result = result.filter((item) => item.completed === false);
    }

    if (search) {
      const searchTerm = search.toLowerCase();

      return result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm),
      );
    }

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
    return result;
  }

  create(taskData: CreateTaskInput) {
    const newTask = {
      id: Math.max(0, ...this.tasks.map((task) => task.id)) + 1,
      title: taskData.title,
      description: taskData.description ?? '',
      completed: taskData.completed ?? false,
    };

    this.tasks.push(newTask);

    return newTask;
  }

  findOne(id: number) {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }

    return task;
  }

  update(id: number, updateData: UpdateTaskDto) {
    const task = this.findOne(id);

    Object.assign(task, updateData);

    return task;
  }

  remove(id: number) {
    const task = this.findOne(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return task;
  }
}
