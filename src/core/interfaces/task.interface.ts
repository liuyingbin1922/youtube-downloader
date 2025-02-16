export interface Task {
  id: string;
  status: TaskStatus;
  type: TaskType;
  url: string;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum TaskType {
  VIDEO_DOWNLOAD = 'video_download',
  AUDIO_EXTRACT = 'audio_extract',
  SPEECH_TO_TEXT = 'speech_to_text',
  TEXT_SUMMARY = 'text_summary',
  ARTICLE_GENERATION = 'article_generation'
} 