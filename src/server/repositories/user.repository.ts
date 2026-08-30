import { UserModel } from '../models/user.model';

export async function updateUserPassword(userId: string, passwordHash: string) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      passwordHash,
      $inc: {
        tokenVersion: 1,
      },
    },
    {
      new: true,
    },
  );
}

export async function incrementTokenVersion(userId: string) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $inc: {
        tokenVersion: 1,
      },
    },
    {
      new: true,
    },
  );
}
