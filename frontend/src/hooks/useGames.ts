import { useCallback, useEffect, useState } from "react";
import { getGames } from "../services/gamesApi";
import type { Game } from "../types/game";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setGames(await getGames());
    } catch {
      setError(
        "Não foi possível carregar o catálogo. Verifique a API e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getGames()
      .then((catalog) => {
        if (active) setGames(catalog);
      })
      .catch(() => {
        if (active) {
          setError(
            "Não foi possível carregar o catálogo. Verifique a API e tente novamente.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { games, isLoading, error, reload: loadGames };
}
