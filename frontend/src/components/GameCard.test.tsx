import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameCard } from "./GameCard";

const game = { id: 1, title: "Neon Horizon", first: "Neon", second: "Horizon", studio: "Studio", category: "Ação", rating: 4.9, price: 99.9, art: "neon", image: "/covers/neon.png" };

describe("GameCard", () => {
  it("adds an available game", () => {
    const onAdd = vi.fn(); render(<GameCard game={{ ...game, available: true }} added={false} onAdd={onAdd} />);
    fireEvent.click(screen.getByRole("button", { name: /adicionar neon horizon/i })); expect(onAdd).toHaveBeenCalledOnce();
  });
  it("blocks unavailable games", () => {
    render(<GameCard game={{ ...game, available: false }} added={false} onAdd={() => undefined} />);
    expect(screen.getByRole("button", { name: /indisponível/i })).toBeDisabled();
  });
});
