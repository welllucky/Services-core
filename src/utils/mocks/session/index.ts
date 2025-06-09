import { AUTH_SECRET_MOCK } from "@/utils/alias/constants";
import { createAccessToken } from "@/utils/functions";
import * as mock from "@ngneat/falso";
import { user } from "../user";

const threeDays = 3 * 24 * 60 * 60 * 1000;

export const validSession = {
  id: mock.incrementalNumber().toString(),
  createdAt: mock.randPastDate(),
  expiresAt: mock.incrementalDate({
    from: new Date(),
    to: new Date(new Date().getTime() + threeDays),
    step: threeDays,
  }) as unknown as Date,
  user: 1,
  isActive: true,
};

export const expiredSession = {
  ...validSession,
  createdAt: new Date(new Date().getTime() - threeDays * 2),
  expiresAt: new Date(new Date().getTime() - threeDays),
};

export const inactiveSession = {
  ...validSession,
  isActive: false,
};

export const mockedAccessToken = createAccessToken(user, AUTH_SECRET_MOCK, 3);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { register, ...withoutRegister } = user;

export const mockedAccessTokenWithoutRegister = createAccessToken(
  { ...withoutRegister },
  AUTH_SECRET_MOCK,
  3,
);

export const sessions = [validSession, expiredSession, inactiveSession];
