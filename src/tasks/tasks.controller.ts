import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { TasksDto } from './dto/tasks.dto.js';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List, filter, search, sort, and paginate tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  findAll(
    @Query('completed') completed?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TasksDto[]> {
    const pageNumber = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
    const pageSize = Math.min(100, Number.parseInt(limit ?? '5', 10) || 5);
    return this.taskService.findAll(
      completed,
      search,
      sortBy,
      order,
      pageNumber,
      pageSize,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'List, filter, search, sort, and paginate task by id',
  })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update existing task property' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a task' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.taskService.remove(id);
  }
}
