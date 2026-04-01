import mongoose, { Schema, Document } from 'mongoose';

//Interface for TypeScript
export interface IFeedback extends Document {
  title: string;
  description: string;
  category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
  status: 'New' | 'In Review' | 'Resolved';
  submitterName?: string;
  submitterEmail?: string;
  
  // AI Generated Fields 
  ai_category?: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

//Mongoose Schema
const FeedbackSchema: Schema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'], 
      maxlength: [120, 'Title cannot exceed 120 characters'] 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'], 
      minlength: [20, 'Description must be at least 20 characters'] 
    },
    category: { 
      type: String, 
      enum: ['Bug', 'Feature Request', 'Improvement', 'Other'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['New', 'In Review', 'Resolved'], 
      default: 'New' 
    },
    submitterName: { type: String },
    submitterEmail: { type: String },

    // AI Analysis Data
    ai_category: { type: String },
    ai_sentiment: { 
      type: String, 
      enum: ['Positive', 'Neutral', 'Negative'] 
    },
    ai_priority: { 
      type: Number, 
      min: 1, 
      max: 10 
    },
    ai_summary: { type: String },
    ai_tags: [{ type: String }],
    ai_processed: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true 
  }
);

//Indexing for Dashboard Performance
FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ ai_priority: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);