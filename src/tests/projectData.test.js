import { describe, expect, test } from "vitest";
import projectData from "../data/projects.json";

describe("project data", () => {
  test("contains at least three projects", () => {
    expect(projectData.projects.length).toBeGreaterThanOrEqual(3);
  });

  test("each project has valid progress between 0 and 100", () => {
    projectData.projects.forEach((project) => {
      expect(project.progress).toBeGreaterThanOrEqual(0);
      expect(project.progress).toBeLessThanOrEqual(100);
    });
  });
});
