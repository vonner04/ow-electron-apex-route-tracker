import type { GameEventsAPI } from "./game-events";

declare global {
  interface Window {
    /** Resolve Property 'gep' does not exist on type 'Window & typeof globalThis'.ts(2339)
     */
    gep: GameEventsAPI;
  }
}

//Prevent global scope pollution
export {};
