import { User } from "@/entities";
import { ADMIN_PASSWORD } from "@/utils/constants";
import { encryptPassword } from "@/utils/functions";
import * as mock from "@ngneat/falso";

const { hashedPassword } = encryptPassword(ADMIN_PASSWORD);

export const user = {
  id: mock.incrementalNumber().toString(),
  name: mock.randFullName(),
  email: mock.randEmail(),
  password: mock.randPassword(),
  createdAt: mock.randPastDate(),
  register: mock.randNumber({ min: 1, max: 1000000 }).toString(),
  hash: hashedPassword,
  lastConnection: mock.randRecentDate(),
  updatedAt: mock.randRecentDate(),
  deletedAt: null,
  role: mock.randRole(),
  systemRole: mock.randRole(),
  sector: mock.randJobType(),
  sessions: [],
  isBanned: mock.randChanceBoolean({ chanceTrue: 0.1 }),
  canCreateTicket: mock.randChanceBoolean({ chanceTrue: 0.9 }),
  canResolveTicket: mock.randChanceBoolean({ chanceTrue: 0.4 }),
};

export const bannedUser = {
  ...user,
  isBanned: true,
} as User;

export const canCreateTicketUser = {
  ...user,
  canCreateTicket: true,
} as User;

export const canResolveTicketUser = {
  ...user,
  canResolveTicket: true,
} as User;

export const users = Array(5).fill(user);
