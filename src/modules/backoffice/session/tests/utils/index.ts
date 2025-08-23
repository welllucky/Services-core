import { Position, Sector, User } from "@/database/entities";

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
    position: {
        id: "1",
        name: "user",
        description: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Position,
    role: "user",
    sector: {
        id: "1",
        name: "IT",
        description: "IT",
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Sector,
    sessions: [],
} as unknown as User;

export const mockedSessionData = (isActive?: boolean) => ({
    id: "1",
    userId: "1",
    isActive: isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(
        new Date().setDate(new Date().getDate() + 1000 * 60 * 60 * 24),
    ),
    user: mockedUser,
    account: {
        id: "1",
        user: mockedUser,
        hash: "hash",
        isBanned: false,
        canCreateTicket: true,
        canResolveTicket: true,
        role: "admin" as const,
        sessions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    },
    hasId: () => true,
    save: async () => mockedSessionData(),
    remove: async () => mockedSessionData(),
    softRemove: async () => mockedSessionData(),
    recover: async () => mockedSessionData(),
    reload: async () => undefined,
});

export const clearMockedSessionData = {
    id: "1",
    userId: "1",
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(),
    user: mockedUser.register,
};
