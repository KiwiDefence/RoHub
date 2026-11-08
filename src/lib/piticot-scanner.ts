import { allStationIds } from "@/lib/piticot";

/** Extracts a station id from a scanned QR value (full URL or bare id). */
export function stationIdFromQr(raw: string): string | null {
  const value = raw.trim();
  const match = value.match(/\/piticot\/scan\/([\w-]+)/i);
  const id = (match ? match[1] : value).toLowerCase();
  return allStationIds().includes(id) ? id : null;
}

export type ScanResult =
  | { kind: "station"; stationId: string }
  | { kind: "unknown"; raw: string }
  | { kind: "cancelled" }
  | { kind: "unavailable"; message: string };

/** Opens the native camera scanner (Google code scanner, no permission prompt). */
export async function scanStationQr(): Promise<ScanResult> {
  const { BarcodeScanner, BarcodeFormat, GoogleBarcodeScannerModuleInstallState } = await import(
    "@capacitor-mlkit/barcode-scanning"
  );
  try {
    const { supported } = await BarcodeScanner.isSupported();
    if (!supported) {
      return { kind: "unavailable", message: "Telefonul nu suportă scanarea." };
    }
    const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!available) {
      await installScannerModule(BarcodeScanner, GoogleBarcodeScannerModuleInstallState);
    }
    const { barcodes } = await BarcodeScanner.scan({ formats: [BarcodeFormat.QrCode] });
    const raw = barcodes[0]?.rawValue ?? "";
    if (!raw) return { kind: "cancelled" };
    const stationId = stationIdFromQr(raw);
    return stationId ? { kind: "station", stationId } : { kind: "unknown", raw };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/cancel/i.test(message)) return { kind: "cancelled" };
    return { kind: "unavailable", message };
  }
}

type ScannerModule = typeof import("@capacitor-mlkit/barcode-scanning");

async function installScannerModule(
  scanner: ScannerModule["BarcodeScanner"],
  State: ScannerModule["GoogleBarcodeScannerModuleInstallState"],
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error("Modulul de scanare nu s-a descărcat. Verifică internetul.")),
      60_000,
    );
    void scanner
      .addListener("googleBarcodeScannerModuleInstallProgress", (event) => {
        if (event.state === State.COMPLETED) {
          window.clearTimeout(timeout);
          resolve();
        } else if (event.state === State.FAILED || event.state === State.CANCELED) {
          window.clearTimeout(timeout);
          reject(new Error("Instalarea modulului de scanare a eșuat."));
        }
      })
      .then(() => scanner.installGoogleBarcodeScannerModule());
  });
}
