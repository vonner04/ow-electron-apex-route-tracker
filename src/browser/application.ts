import { GameInfo, GameLaunchEvent } from "@overwolf/ow-electron-packages-types";
import { MainWindowController } from "@/browser/controllers/main-window-controller";
import { OverlayService } from "@/browser/services/overlay-service";
import { kGameIds } from "@overwolf/ow-electron-packages-types/game-list";
import { GameEventsService } from "@/browser/services/game-events-service";
import { APEXLEGENDS_GAMEID } from "@/constants";

export class Application {
  /**
   *
   */
  constructor(
    private readonly overlayService: OverlayService,
    private readonly gepService: GameEventsService,
    private readonly mainWindowController: MainWindowController
  ) {
    overlayService.on("ready", this.onOverlayServiceReady.bind(this));

    overlayService.on(
      "injection-decision-handling",
      (event: GameLaunchEvent, gameInfo: GameInfo) => {
        // Always inject because we tell it which games we want in
        // onOverlayServiceReady
        event.inject();
      }
    );

    // for gep supported games goto:
    // https://overwolf.github.io/api/electron/game-events/
    gepService.registerGames([APEXLEGENDS_GAMEID]);
  }

  /**
   *
   */
  public run() {
    this.initialize();
  }

  /**
   *
   */
  private initialize() {
    const showDevTools = true;
    this.mainWindowController.createAndShow(showDevTools);
  }

  /**
   *
   */
  private onOverlayServiceReady() {
    // Which games to support overlay for
    this.overlayService.registerToGames([APEXLEGENDS_GAMEID]);
  }
}
