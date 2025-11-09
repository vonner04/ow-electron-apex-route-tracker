/** There are two types of info: game and match.
 * Interest in getting map name and current location.
 * {"info":{"match_info":{"location":"{"x":"93","y":"305","z":"49"}"}},"feature":"location"}
 * {"feature":"match_info","category":"match_info","key":"map_name","value":"Olympus"}
 * but sometimes match_info is inside 'info'
 */
export type OverwolfApexLocationPayload = {
  feature: "location";
  info: {
    match_info: {
      location: string;
    };
  };
};

export type OverwolfApexEventPayload = {
  feature: string;
  category: string;
  key: string;
  value: unknown;
};

export type GameEventsPayload = OverwolfApexLocationPayload | OverwolfApexEventPayload;

export interface GameEventsAPI {
  onMessage(func: (...args: unknown[]) => void);
  setRequiredFeature();
  getInfo();
}
