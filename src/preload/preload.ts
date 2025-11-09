import { contextBridge, ipcRenderer } from "electron";

console.log("🔌 Preload script starting...");
/**List of invokes from main-window-controller.ts
 * createOSR
 * gep-set-required-feature
 * gep-getInfo
 * toggleOSRVisibility
 * updateHotkey
 * some ExclusiveMode which I have no clue about; commented out
 */
//TODO: seems like this allows all kinds of info to be presented
contextBridge.exposeInMainWorld("gep", {
  onMessage: (func: (...args: unknown[]) => void) => {
    ipcRenderer.on("console-message", (e, ...args) => {
      func(...args);
    });
  },

  setRequiredFeature: () => {
    console.log("Preload: Calling gep-set-required-feature");
    return ipcRenderer
      .invoke("gep-set-required-feature")
      .then((result) => {
        console.log("Preload: gep-set-required-feature result:", result);
        return result;
      })
      .catch((err) => {
        console.error("Preload: gep-set-required-feature error:", err);
        throw err;
      });
  },

  getInfo: () => {
    return ipcRenderer.invoke("gep-getInfo");
  },
});
