import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { VideoService } from './video/video.service';
import { SpeechService } from './speech/speech.service';
import { TextService } from './text/text.service';
import { TaskService } from './core/services/task.service';

@Controller()
export class AppController {
  constructor(
    private readonly videoService: VideoService,
    private readonly speechService: SpeechService,
    private readonly textService: TextService,
    private readonly taskService: TaskService,
  ) {}

  @Post('process')
  async processVideo(@Body() body: { url: string }) {
    const videoTask = await this.videoService.processVideo(body.url);
    if (videoTask.status === 'failed') {
      return videoTask;
    }

    const transcriptionTask = await this.speechService.transcribe(videoTask.result);
    if (transcriptionTask.status === 'failed') {
      return transcriptionTask;
    }

    const summaryTask = await this.textService.generateSummary(transcriptionTask.result);
    if (summaryTask.status === 'failed') {
      return summaryTask;
    }

    const articleTask = await this.textService.generateArticle(summaryTask.result);
    return articleTask;
  }

  @Get('task/:id')
  async getTaskStatus(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  // 测试视频下载
  @Get('download')
  async downloadVideo(@Query('url') url: string) {
    return this.videoService.processVideo(url);
  }

  // 测试文本摘要生成
  @Post('summary')
  async generateSummary(@Body() body: { text: string }) {
    return this.textService.generateSummary(body.text);
  }

  // 测试文章生成
  @Post('article')
  async generateArticle(@Body() body: { summary: string }) {
    return this.textService.generateArticle(body.summary);
  }

  // 简单的健康检查
  @Get()
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
} 