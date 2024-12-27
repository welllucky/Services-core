import { User } from "@/entities";

export const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RlciI6IjI0MjQyNCIsImVtYWlsIjoid2VsbEBsMy5jb20iLCJuYW1lIjoiV2VsbGluZ3RvbiBCcmFnYSIsImxhc3RDb25uZWN0aW9uIjpudWxsLCJpc0Jhbm5lZCI6ZmFsc2UsImNhbkNyZWF0ZVRpY2tldCI6dHJ1ZSwiY2FuUmVzb2x2ZVRpY2tldCI6dHJ1ZSwicm9sZSI6IkNFTyIsInNlY3RvciI6Ik9mZmljZSIsImlhdCI6MTczNTEwOTU3NiwiZXhwIjoxNzM1MzY4Nzc2fQ.fbGV4Hq-0BZkZT55fZ8JLxOId73A3Hwe_nUTsBgRwxk";

export const tokenWithoutRegister =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndlbGxAbDMuY29tIiwibmFtZSI6IldlbGxpbmd0b24gQnJhZ2EiLCJsYXN0Q29ubmVjdGlvbiI6bnVsbCwiaXNCYW5uZWQiOmZhbHNlLCJjYW5DcmVhdGVUaWNrZXQiOnRydWUsImNhblJlc29sdmVUaWNrZXQiOnRydWUsInJvbGUiOiJDRU8iLCJzZWN0b3IiOiJPZmZpY2UiLCJpYXQiOjE3MzUyNjUwNDIsImV4cCI6MTczNTUyNDI0Mn0.g-BUMd-pv2O0dxyzVgLaVxcsy-_NDqPsX5l93IG7XJU";

export const credentials = {
  email: "test@example.com",
  password: "teste12345",
};

export const mockedUser = {
  id: "1",
  name: "Test",
  email: "test@example.com",
  password: "XXXXXXXX",
  createdAt: new Date(),
  register: String(new Date()),
  hash: "hash",
  lastConnection: new Date(),
  isBanned: false,
  canCreateTicket: true,
  canResolveTicket: true,
  updatedAt: new Date(),
  deletedAt: null,
  role: "user",
  systemRole: "user",
  sector: "IT",
  sessions: [],
} as User;

export const mockedSessionData = (isActive?: boolean) => ({
  id: "1",
  userId: "1",
  isActive: isActive ?? true,
  createdAt: new Date(),
  expiresAt: new Date(),
  user: mockedUser,
  hasId: () => true,
  save: async () => mockedSessionData(),
  remove: async () => mockedSessionData(),
  softRemove: async () => mockedSessionData(),
  recover: async () => mockedSessionData(),
  reload: async () => undefined,
});
