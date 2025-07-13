import * as mock from "@ngneat/falso";

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

export const mockedAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicmVnaXN0ZXIiOiIyNDI0MjQiLCJlbWFpbCI6IndlbGxAbDMuY29tIiwibmFtZSI6IldlbGxpbmd0b24gQnJhZ2EiLCJwb3NpdGlvbiI6IkNFTyIsInNlY3RvciI6Ik9mZmljZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUyNDU0MzQwLCJleHAiOjE3NTI3MTM1NDAsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.sT0N-tVr16W0i0SDSxHTlolVQ7ypX5DXSa5Zorp6s1M";

export const sessions = [validSession, expiredSession, inactiveSession];
