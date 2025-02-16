import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TaskService } from '../core/services/task.service';
import { TaskType, TaskStatus } from '../core/interfaces/task.interface';
import * as fs from 'fs';

@Injectable()
export class SpeechService {
  private openai: OpenAI;

  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
    private readonly taskService: TaskService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      baseURL: 'https://api.zhizengzeng.com/v1',
    });
  }

  async transcribe(audioFilePath: string) {
    const task = this.taskService.createTask(TaskType.SPEECH_TO_TEXT, audioFilePath);

    try {
      this.taskService.updateTask(task.id, { status: TaskStatus.PROCESSING });
      
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
      });

      return this.taskService.updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        result: response.text,
      });
    } catch (error) {
      return this.taskService.updateTask(task.id, {
        status: TaskStatus.FAILED,
        error: error.message,
      });
    }
  }
} 