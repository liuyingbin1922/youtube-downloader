import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { TaskService } from '../core/services/task.service';
import { TaskType, TaskStatus } from '../core/interfaces/task.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TextService {
  private openai: OpenAI;

  constructor(
    private readonly taskService: TaskService,
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      baseURL: 'https://api.zhizengzeng.com/v1',
    });
  }

  async generateSummary(text: string) {
    const task = this.taskService.createTask(TaskType.TEXT_SUMMARY, 'text-input');

    try {
      this.taskService.updateTask(task.id, { status: TaskStatus.PROCESSING });

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates concise summaries."
          },
          {
            role: "user",
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
      });

      return this.taskService.updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        result: response.choices[0].message.content,
      });
    } catch (error) {
      return this.taskService.updateTask(task.id, {
        status: TaskStatus.FAILED,
        error: error.message,
      });
    }
  }

  async generateArticle(summary: string) {
    const task = this.taskService.createTask(TaskType.ARTICLE_GENERATION, 'summary-input');

    try {
      this.taskService.updateTask(task.id, { status: TaskStatus.PROCESSING });

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional writer that creates well-structured articles."
          },
          {
            role: "user",
            content: `Create a detailed article based on this summary:\n\n${summary}`
          }
        ],
      });

      return this.taskService.updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        result: response.choices[0].message.content,
      });
    } catch (error) {
      return this.taskService.updateTask(task.id, {
        status: TaskStatus.FAILED,
        error: error.message,
      });
    }
  }
}