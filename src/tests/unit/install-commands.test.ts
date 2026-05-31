import { describe, it, expect } from "vitest";
import {
  generateInstallCommand,
  generateAddCommand,
  generateUpdateCommand,
  generateBundleInstallCommand,
  generateUninstallCommand,
  parseAgentIdentifier,
} from "@/lib/install-commands";

describe("Install Commands", () => {
  describe("generateInstallCommand", () => {
    it("should generate a valid install command", () => {
      const cmd = generateInstallCommand("anthropic", "code-reviewer");
      expect(cmd).toBe("claude agent install anthropic/code-reviewer");
    });
  });

  describe("generateAddCommand", () => {
    it("should generate a valid add command", () => {
      const cmd = generateAddCommand("anthropic", "code-reviewer");
      expect(cmd).toBe("claude agent add anthropic/code-reviewer");
    });
  });

  describe("generateUpdateCommand", () => {
    it("should generate a valid update command", () => {
      const cmd = generateUpdateCommand("anthropic", "code-reviewer");
      expect(cmd).toBe("claude agent update anthropic/code-reviewer");
    });
  });

  describe("generateBundleInstallCommand", () => {
    it("should generate a bundle install command", () => {
      const cmd = generateBundleInstallCommand("anthropic", "full-stack-toolkit");
      expect(cmd).toBe("claude bundle install anthropic/full-stack-toolkit");
    });
  });

  describe("generateUninstallCommand", () => {
    it("should generate a valid uninstall command", () => {
      const cmd = generateUninstallCommand("anthropic", "code-reviewer");
      expect(cmd).toBe("claude agent remove anthropic/code-reviewer");
    });
  });

  describe("parseAgentIdentifier", () => {
    it("should parse a full identifier", () => {
      const result = parseAgentIdentifier("anthropic/code-reviewer");
      expect(result).toEqual({ publisher: "anthropic", agent: "code-reviewer", version: undefined });
    });

    it("should handle version suffix", () => {
      const result = parseAgentIdentifier("anthropic/code-reviewer@2.1.0");
      expect(result).toEqual({ publisher: "anthropic", agent: "code-reviewer", version: "2.1.0" });
    });

    it("should return null for invalid identifier", () => {
      const result = parseAgentIdentifier("invalid");
      expect(result).toBeNull();
    });
  });
});
