import { User } from "@/entities";

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
