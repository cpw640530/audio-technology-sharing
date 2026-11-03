import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LearningPaths, learningPaths } from "./LearningPaths";
import { getTopicKey } from "../content/relatedTopics";

afterEach(cleanup);
it.each(["zh", "en"] as const)("opens every learning-path destination (%s)", language => {
  const onOpen = vi.fn();
  render(<LearningPaths language={language} onOpen={onOpen} />);
  const region = screen.getByRole("region", { name: language === "zh" ? "学习路线" : "Learning paths" });
  const buttons = within(region).getAllByRole("link");
  const keys = learningPaths.flatMap(path => path.topics);
  expect(buttons).toHaveLength(keys.length);
  buttons.forEach((button, index) => {
    fireEvent.click(button);
    expect(getTopicKey(onOpen.mock.calls[index][0])).toBe(keys[index]);
  });
});
