import type { ReactNode } from "react";

type GameScreenProps = {
  board: ReactNode;
  hud: ReactNode;
  /** Height reserved under the board for the HUD (px). */
  hudHeight: number;
};

/** Board sized to fit the viewport at 9:16, with the HUD underneath. */
export function GameScreen({ board, hud, hudHeight }: GameScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-[env(safe-area-inset-top)]">
      <div
        className="relative shrink-0"
        style={{
          width: `min(100vw, calc((100dvh - ${hudHeight}px - env(safe-area-inset-top)) * 9 / 16))`,
          aspectRatio: "9 / 16",
        }}
      >
        {board}
      </div>
      <div className="flex min-h-0 w-full max-w-md flex-1 flex-col justify-center px-5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {hud}
      </div>
    </div>
  );
}
