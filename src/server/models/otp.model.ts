import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose';

const otpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
      select: false,
    },
    purpose: {
      type: String,
      enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'],
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      index: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ userId: 1, purpose: 1, createdAt: -1 });

export type OTP = InferSchemaType<typeof otpSchema>;
export const OtpModel =
  (mongoose.models.OTP as Model<OTP>) ?? mongoose.model<OTP>('OTP', otpSchema);
