/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

console.log("Renderer starting...");
console.log("window.gep available:", !!window.gep);
if (window.gep) {
  console.log("gep methods:", Object.keys(window.gep));
} else {
  console.error("window.gep is not defined! Check preload script.");
}
console.log("Looking for UI elements...");

const btnSetRequiredFeatures = document.querySelector("#btn-setRequiredFeatures");

if (!btnSetRequiredFeatures) {
  console.error("Required features button not found! Check your HTML IDs.");
  throw new Error("Button not found");
}

function addMessageToTerminal(message: string) {
  const terminal = document.querySelector("#TerminalLog");
  terminal.append(message + "\n");
  terminal.scrollTop = terminal.scrollHeight;
}
//TODO: seems like this allows all kinds of info to be presented

window.gep.onMessage(function (...args: unknown[]) {
  console.info(...args);

  let item = "";
  args.forEach((arg) => {
    item = `${item}-${JSON.stringify(arg)}`;
  });
  addMessageToTerminal(item);
});

async function handleSetRequiredFeaturesClick() {
  try {
    console.log("Renderer: Button clicked, calling setRequiredFeature");
    addMessageToTerminal("Calling setRequiredFeature...");
    const result = await window.gep.setRequiredFeature();
    console.log("Renderer: setRequiredFeature result:", result);
    addMessageToTerminal(`setRequiredFeatures OK: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("Renderer: setRequiredFeature error:", error);
    addMessageToTerminal(`setRequiredFeatures error: ${error.message || error}`);
  }
}

btnSetRequiredFeatures.addEventListener("click", handleSetRequiredFeaturesClick);
