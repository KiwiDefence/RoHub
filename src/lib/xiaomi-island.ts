import { registerPlugin } from "@capacitor/core";
import { isNativeApp } from "@/lib/native";

type IslandSupport = {
  xiaomi: boolean;
  islandFeature: boolean;
  focusProtocol: number;
  hasFocusPermission: boolean;
  supported: boolean;
};

type IslandItem = {
  id: number;
  title: string;
  body: string;
  shortTitle?: string;
  route?: string;
  delayMs?: number;
  ongoing?: boolean;
};

type XiaomiIslandPlugin = {
  isSupported(): Promise<IslandSupport>;
  show(options: {
    id?: number;
    title: string;
    body: string;
    shortTitle?: string;
    route?: string;
    ongoing?: boolean;
    cancel?: boolean;
  }): Promise<void>;
  cancel(options?: { id?: number }): Promise<void>;
  showSequence(options: { items: IslandItem[] }): Promise<void>;
  openFocusSettings(): Promise<void>;
};

const XiaomiIsland = registerPlugin<XiaomiIslandPlugin>("XiaomiIsland");

export async function getXiaomiIslandSupport(): Promise<IslandSupport | null> {
  if (!isNativeApp()) return null;
  try {
    return await XiaomiIsland.isSupported();
  } catch {
    return null;
  }
}

export async function showXiaomiIsland(input: {
  id?: number;
  title: string;
  body: string;
  shortTitle?: string;
  route?: string;
  ongoing?: boolean;
}): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    await XiaomiIsland.show({
      id: input.id ?? 41001,
      title: input.title,
      body: input.body,
      shortTitle: input.shortTitle ?? "RoHub",
      route: input.route ?? "/calatorie/",
      ongoing: input.ongoing ?? true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelXiaomiIsland(id = 41001): Promise<void> {
  if (!isNativeApp()) return;
  try {
    await XiaomiIsland.cancel({ id });
  } catch {
    /* ignore */
  }
}

export async function showXiaomiIslandSequence(
  items: IslandItem[],
): Promise<boolean> {
  if (!isNativeApp()) return false;
  try {
    await XiaomiIsland.showSequence({ items });
    return true;
  } catch {
    return false;
  }
}

export async function openXiaomiFocusSettings(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    await XiaomiIsland.openFocusSettings();
  } catch {
    /* ignore */
  }
}
