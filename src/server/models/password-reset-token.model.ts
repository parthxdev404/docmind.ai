import mongoose, { type InferSchemaType, type Model, Schema } from 'mongoose';

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordResetToken = InferSchemaType<typeof mongoose>;
export const PasswordResetTokenModel =
  (mongoose.models.PasswordResetToken as Model<PasswordResetToken>) ??
  mongoose.model<PasswordResetToken>(
    'PasswordResetToken',
    passwordResetTokenSchema,
  );
