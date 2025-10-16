// models/performance.ts
import mongoose, { Schema } from 'mongoose';

interface Performance {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  topic: string;  
  questionsAnswered: number;
  correctAnswers: number;
  score: number;
  timeTaken: number;
}

const performanceSchema = new Schema<Performance>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String,
    required: true
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number,
    default: 0
  }
});

const PerformanceModel = mongoose.model<Performance>('Performance', performanceSchema);

export default PerformanceModel