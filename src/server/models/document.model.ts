import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const documentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    storageKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    extension: {
      type: String,
      required: true,
      lowercase: true,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ['UPLOADED', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'UPLOADED',
      required: true,
      index: true,
    },

    processingError: {
      type: String,
      default: null,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({
  userId: 1,
  createdAt: -1,
});

documentSchema.index({
  userId: 1,
  status: 1,
});

export type Document = InferSchemaType<typeof documentSchema>;

export const DocumentModel =
  (mongoose.models.Document as Model<Document>) ??
  mongoose.model<Document>('Document', documentSchema);
