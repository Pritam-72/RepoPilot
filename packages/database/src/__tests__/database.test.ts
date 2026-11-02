import { describe, it, expect } from "vitest";
import { prisma } from "../index.js";

describe("Database package", () => {
  it("exports prisma client singleton", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.user.findMany).toBe("function");
    expect(typeof prisma.reviewJob.findUnique).toBe("function");
    expect(typeof prisma.finding.create).toBe("function");
  });
});
