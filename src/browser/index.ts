import { app as ElectronApp } from "electron";
import { Application } from "./application";
import { OverlayHotkeysService } from "@/browser/services/overlay-hotkey-service";
import { OverlayService } from "@/browser/services/overlay-service";
import { GameEventsService } from "@/browser/services/game-events-service";
import { MainWindowController } from "@/browser/controllers/main-window-controller";
import { OSRWindowController } from "@/browser/controllers/osr-window-controller";
import { OverlayInputService } from "@/browser/services/overlay-input-service";

/**
 * TODO: Integrate your own dependency-injection library
 */
const bootstrap = (): Application => {
  const overlayService = new OverlayService();
  const overlayHotkeysService = new OverlayHotkeysService(overlayService);
  const gepService = new GameEventsService();
  const inputService = new OverlayInputService(overlayService);

  const createDemoOsrWindowControllerFactory = (): OSRWindowController => {
    const controller = new OSRWindowController(overlayService);
    return controller;
  };

  const mainWindowController = new MainWindowController(
    gepService,
    overlayService,
    createDemoOsrWindowControllerFactory,
    overlayHotkeysService,
    inputService
  );

  return new Application(overlayService, gepService, mainWindowController);
};

const app = bootstrap();

ElectronApp.whenReady().then(() => {
  app.run();
});

ElectronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    ElectronApp.quit();
  }
});
