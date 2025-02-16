import { Injectable } from '@nestjs/common';
import { Task, TaskStatus, TaskType } from '../interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: Map<string, Task> = new Map();

  createTask(type: TaskType, url: string): Task {
    const task: Task = {
      id: uuidv4(),
      status: TaskStatus.PENDING,
      type,
      url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(task.id, task);
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  getTask(id: string): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }
} 