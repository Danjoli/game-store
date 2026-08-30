import { Gamepad2 } from "lucide-react";

export function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label="Game Store — início">
      <i>
        <Gamepad2 />
      </i>
      <b>
        GAME<span>STORE</span>
      </b>
    </a>
  );
}
