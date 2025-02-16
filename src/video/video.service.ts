import { Injectable } from '@nestjs/common';
import { exec } from 'youtube-dl-exec';
import { join } from 'path';
import { TaskService } from '../core/services/task.service';
import { TaskType, TaskStatus } from '../core/interfaces/task.interface';

@Injectable()
export class VideoService {
  constructor(private readonly taskService: TaskService) {}

  async processVideo(url: string) {
    const task = this.taskService.createTask(TaskType.VIDEO_DOWNLOAD, url);
    
    try {
      const outputDir = join(process.cwd(), 'downloads');
      const options = {
        extractAudio: true,
        audioFormat: 'mp3',
        output: join(outputDir, '%(title)s.%(ext)s'),
      };

      this.taskService.updateTask(task.id, { status: TaskStatus.PROCESSING });
      const output = await exec(url, options);
      
      return this.taskService.updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        result: output,
      });
    } catch (error) {
      return this.taskService.updateTask(task.id, {
        status: TaskStatus.FAILED,
        error: error.message,
      });
    }
  }

  async downloadVideo(url: string, options: any) {
    try {
      const output = await exec(url, options);
      return output;
    } catch (error) {
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }
} 