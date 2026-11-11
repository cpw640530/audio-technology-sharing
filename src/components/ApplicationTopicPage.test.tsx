import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { categories } from "../content/knowledge";
import { applicationFlows } from "../content/applicationFlows";
import { ApplicationTopicPage } from "./ApplicationTopicPage";
import { applicationProducts } from "../content/applicationProducts";
import { getTopicKey } from "../content/relatedTopics";

const topics = categories.flatMap(category => category.id === "applications"
  ? category.topics.map(topic => ({ ...topic, category })) : []);
const pathIds: Record<string, string[]> = {
  "bluetooth-audio": ["media"],
  "meeting-communication": ["send", "receive"],
  "automotive-audio": ["voice", "spatial", "anc"],
  "robot-audio": ["interaction"],
  "iot-content": ["sensing", "production"]
};

it("covers all five existing application topics", () => {
  expect(topics).toHaveLength(5);
  expect(topics.map(getTopicKey).sort()).toEqual(Object.keys(pathIds).sort());
  expect(topics.filter(topic => topic.detail.lab).map(getTopicKey).sort()).toEqual(["automotive-audio", "bluetooth-audio", "robot-audio"]);
});

it.each(topics)("keeps independent paths, translations, contents, and navigation for $title.en", topic => {
  const type = getTopicKey(topic)!;
  const flow = applicationFlows[type];
  for (const language of ["zh", "zh-Hant", "en", "ja", "ko"] as const) {
    const onBack = vi.fn();
    const onOpenLab = vi.fn();
    const onOpenPrevious = vi.fn();
    const onOpenNext = vi.fn();
    const { container, unmount } = render(<ApplicationTopicPage topic={topic} language={language}
      onBack={onBack} onOpenLab={onOpenLab} onOpenPrevious={onOpenPrevious} onOpenNext={onOpenNext} />);
    const paths = Array.from(container.querySelectorAll(".application-path"));
    expect(paths.map(path => path.getAttribute("data-path"))).toEqual(pathIds[type]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(topic.title[language]);
    const photos = applicationProducts[type];
    expect(container.querySelectorAll(".application-product")).toHaveLength(photos.length);
    for (const photo of photos) {
      const image = screen.getByRole("img", { name: photo.title[language] });
      expect(image).toHaveAttribute("src", `${import.meta.env.BASE_URL}images/${photo.image}`);
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image.parentElement).toHaveAttribute("href", image.getAttribute("src"));
      const figure = within(image.closest("figure")!);
      expect(figure.getByText(photo.caption[language])).toBeVisible();
      expect(figure.getByRole("link", { name: photo.license })).toHaveAttribute("href", photo.licenseUrl);
      expect(figure.getAllByRole("link").some(link => link.getAttribute("href") === photo.source)).toBe(true);
      expect(photo.title[language].trim()).not.toBe("");
      expect(photo.caption[language].trim()).not.toBe("");
    }
    for (const path of flow.paths) {
      const list = screen.getByRole("list", { name: path.title[language] });
      expect(within(list).getAllByRole("listitem").map(item => item.querySelector("p")?.textContent))
        .toEqual(path.steps.map(step => step[language]));
      expect(list.querySelectorAll(".application-step-arrow")).toHaveLength(path.steps.length - 1);
      expect(screen.getByText(path.note[language])).toBeInTheDocument();
      for (const value of [path.title, path.note, ...path.steps]) expect(value[language].trim()).not.toBe("");
    }
    expect(container.querySelector(".application-path-feedback")?.textContent ?? null).toBe(flow.feedback?.[language] ?? null);
    expect(container.querySelector(".application-path-check")).toHaveTextContent(flow.check[language]);
    const headings = Array.from(container.querySelectorAll(".sound-topic-content h2"));
    const contentsLinks = Array.from(container.querySelectorAll(".topic-contents nav a"));
    expect(contentsLinks.map(link => link.getAttribute("href"))).toEqual(headings.map(h => `#${h.id}`));
    if (topic.detail.lab) {
      fireEvent.click(screen.getByRole("button", { name: topic.detail.lab.buttonLabel[language] }));
      expect(onOpenLab).toHaveBeenCalledOnce();
    } else {
      expect(container.querySelector(".application-topic-lab-entry")).not.toBeInTheDocument();
      expect(container.querySelectorAll("main")).toHaveLength(1);
      expect(container.querySelectorAll("h1")).toHaveLength(1);
      expect(onOpenLab).not.toHaveBeenCalled();
    }
    fireEvent.click(container.querySelector<HTMLButtonElement>(".sound-topic-back")!);
    expect(onBack).toHaveBeenCalledOnce();
    const pagerButtons = within(container.querySelector<HTMLElement>(".topic-pager")!).getAllByRole("button");
    fireEvent.click(pagerButtons[0]);
    fireEvent.click(pagerButtons[2]);
    expect(onOpenPrevious).toHaveBeenCalledOnce();
    expect(onOpenNext).toHaveBeenCalledOnce();
    unmount();
  }
});

it("assigns local photographs with explicit credits to every application", () => {
  expect(Object.keys(applicationProducts).sort()).toEqual(Object.keys(pathIds).sort());
  for (const photo of Object.values(applicationProducts).flat()) {
    expect(photo.image).toMatch(/^[a-z-]+\.(webp|jpg)$/);
    expect(photo.source).toMatch(/^https:\/\/commons.wikimedia.org\/wiki\/File:/);
    expect(photo.author.trim()).not.toBe("");
  }
});

it("keeps car photographs in the article and reserves 3D interaction for the lab", () => {
  const topic = topics.find(topic => topic.detail.lab?.type === "automotive-audio")!;
  const { container } = render(<ApplicationTopicPage topic={topic} language="en" onBack={vi.fn()} onOpenLab={vi.fn()} />);
  expect(container.querySelector(".car-speaker-layout")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "3D layout" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: topic.detail.lab!.buttonLabel.en })).toBeVisible();
  expect(screen.getByRole("img", { name: applicationProducts["automotive-audio"][0].title.en })).toBeVisible();
});

it("keeps ANC separate from ASR and references the post-superposition error measurement", () => {
  const paths = applicationFlows["automotive-audio"].paths;
  expect(paths.find(path => path.id === "anc")!.steps.map(step => step.en).join(" ")).not.toMatch(/ASR/);
  expect(paths.find(path => path.id === "anc")!.note.en).toMatch(/residual noise after superposition/);
  expect(applicationFlows["meeting-communication"].feedback!.en).toMatch(/render PCM.*send-side AEC reference/);
  expect(applicationFlows["robot-audio"].paths[0].steps[2].en).toMatch(/permissions.*safety/);
});
