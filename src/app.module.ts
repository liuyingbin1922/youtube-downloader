import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { VideoService } from './video/video.service';
import { SpeechService } from './speech/speech.service';
import { TextService } from './text/text.service';
import { TaskService } from './core/services/task.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    VideoService,
    SpeechService,
    TextService,
    TaskService,
  ],
})
export class AppModule {} 