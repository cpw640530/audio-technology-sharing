import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { categories, type Language } from "../content/knowledge";
import { DigitalInterfaceGuide } from "./DigitalInterfaceGuide";

const lab = categories.flatMap(category => category.topics).find(topic => topic.detail.lab?.type === "digital-interface")!.detail.lab!;

describe("DigitalInterfaceGuide", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("connects selection, transport and clock budgets in %s", async language => {
    const onOpenLab = vi.fn();
    render(<DigitalInterfaceGuide language={language} lab={lab} onOpenLab={onOpenLab} />);
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(6);
    expect(screen.getByText("48,000 × 24 × 2 = 2.304 Mbit/s")).toBeInTheDocument();
    expect(screen.getByText("48,000 × 2 × 32 = 3.072 MHz")).toBeInTheDocument();
    expect(document.querySelectorAll(".interface-reading-flow li")).toHaveLength(5);
    expect(document.querySelectorAll(".interface-reading-checklist li")).toHaveLength(4);
    const button = screen.getByRole("button", { name: lab.buttonLabel[language] });
    expect(button.compareDocumentPosition(screen.getByText("BCLK = fₛ × slots × slot_bits")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(button);
    expect(onOpenLab).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: /NXP/ })).toHaveAttribute("href", "https://www.nxp.com/docs/en/user-manual/UM11732.pdf");
  });
});
