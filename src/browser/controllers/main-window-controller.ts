import { app as electronApp, ipcMain, BrowserWindow } from "electron";
import { GameEventsService } from "@/browser/services/game-events-service";
import path from "path";
import { OSRWindowController } from "@/browser/controllers/osr-window-controller";
import { OverlayService } from "@/browser/services/overlay-service";
import { overwolf } from "@overwolf/ow-electron";
import { OverlayHotkeysService } from "@/browser/services/overlay-hotkey-service";
import { ExclusiveHotKeyMode, OverlayInputService } from "@/browser/services/overlay-input-service";

const owElectronApp = electronApp as overwolf.OverwolfApp;

/**
 *
 */
export class MainWindowController {
  private initializePackageListeners() {
    if (!owElectronApp.overwolf?.packages) {
      this.printLogMessage("Package manager not available");
      return;
    }

    owElectronApp.overwolf.packages.on("crashed", (e, ...args) => {
      this.printLogMessage("package crashed", ...args);
      // ow-electron package manager crashed (will be auto relaunch)
      // e.preventDefault();
      // calling `e.preventDefault();` will stop the GEP Package from
      // automatically re-launching
    });

    owElectronApp.overwolf.packages.on(
      "failed-to-initialize",
      this.logPackageManagerErrors.bind(this)
    );
  }
  private browserWindow: BrowserWindow = null;

  /**
   *
   */
  constructor(
    private readonly gepService: GameEventsService,
    private readonly overlayService: OverlayService,
    private readonly createOsrWinController: () => OSRWindowController,
    private readonly overlayHotkeysService: OverlayHotkeysService,
    private readonly overlayInputService: OverlayInputService
  ) {
    this.registerToIpc();

    gepService.on("log", this.printLogMessage.bind(this));
    overlayService.on("log", this.printLogMessage.bind(this));

    overlayHotkeysService.on("log", this.printLogMessage.bind(this));

    // Wait for app to be ready before setting up package listeners
    if (electronApp.isReady()) {
      this.initializePackageListeners();
    } else {
      electronApp.on("ready", () => {
        this.initializePackageListeners();
      });
    }
  }

  /**
   *
   */
  public printLogMessage(message: String, ...args: any[]) {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }
    this.browserWindow?.webContents?.send("console-message", message, ...args);
  }

  //----------------------------------------------------------------------------
  private logPackageManagerErrors(packageName: String, ...args: any[]) {
    this.printLogMessage("Overwolf Package Manager error!", packageName, ...args);
  }

  /**
   *
   */
  public createAndShow(showDevTools: boolean) {
    this.browserWindow = new BrowserWindow({
      width: 900,
      height: 900,
      show: true,
      webPreferences: {
        // NOTE: nodeIntegration and contextIsolation are only required for this
        // specific demo app, they are not a neceassry requirement for any other
        // ow-electron applications
        nodeIntegration: true,
        contextIsolation: true,
        devTools: showDevTools,
        // relative to root folder of the project
        preload: path.join(__dirname, "../preload/preload.js"),
      },
    });

    this.browserWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  /**
   *
   */
  private registerToIpc() {
    ipcMain.handle("createOSR", async () => await this.createOSRDemoWindow());

    ipcMain.handle("gep-set-required-feature", async () => {
      await this.gepService.setRequiredFeaturesForAllSupportedGames();
      return true;
    });

    ipcMain.handle("gep-getInfo", async () => {
      return await this.gepService.getInfoForActiveGame();
    });

    ipcMain.handle("toggleOSRVisibility", async () => {
      this.overlayService?.overlayApi?.getAllWindows().forEach((e) => {
        e.window.show();
      });
    });

    ipcMain.handle("updateHotkey", async () => {
      this.overlayHotkeysService?.updateHotkey();
    });

    ipcMain.handle("updateExclusiveOptions", async (sender, options) => {
      this.overlayInputService?.updateExclusiveModeOptions(options);
    });

    ipcMain.handle("EXCLUSIVE_TYPE", async (sender, type) => {
      if (!this.overlayInputService) {
        return;
      }

      if (type === "customWindow") {
        this.overlayInputService.exclusiveModeAsWindow = true;
      } else {
        // native
        this.overlayInputService.exclusiveModeAsWindow = false;
      }
    });

    ipcMain.handle("EXCLUSIVE_BEHAVIOR", async (sender, behavior) => {
      if (!this.overlayInputService) {
        return;
      }

      if (behavior === "toggle") {
        this.overlayInputService.mode = ExclusiveHotKeyMode.Toggle;
      } else {
        // native
        this.overlayInputService.mode = ExclusiveHotKeyMode.AutoRelease;
      }
    });
  }

  /**
   *
   */
  private async createOSRDemoWindow(): Promise<void> {
    const controller = this.createOsrWinController();

    const showDevTools = true;
    await controller.createAndShow(showDevTools);

    controller.overlayBrowserWindow.window.on("closed", () => {
      this.printLogMessage("osr window closed");
    });
  }
}
