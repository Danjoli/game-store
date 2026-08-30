import axios from "axios";
import { fallbackGames } from "../data/games";
import type { Game } from "../types/game";

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

type GamesResponse = Game[] | { data: Game[] };

export async function getGames(): Promise<Game[]> {
  if (!apiUrl) return fallbackGames;

  const response = await axios.get<GamesResponse>(`${apiUrl}/api/games`);
  return Array.isArray(response.data) ? response.data : response.data.data;
}
