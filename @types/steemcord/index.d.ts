interface PresenceData {
	state?: string;
	details?: string;
	startTimestamp?: number;
	endTimestamp?: number;
	largeImageKey?: string;
	largeImageText?: string;
	smallImageKey?: string;
  smallImageText?: string;
  partyCount?: number;
  partySize?: number;
}

interface SteamPresenceData {
  presenceArray: Array<{ key: string; value: string; }>;
  presence: { [key: string]: string };
  presenceString?: string;
}

interface PresenceOptions {
  clientID: string;
  appID?: number;
  module?: NodeModule;
}

declare class Presence {
  private clientID: string;
  private appID: number;
  private _eventCount: number;

  /**
   * The current presence data that was sent to Discord
   */
  public currentPresence: PresenceData;

  /**
   * Create a new Presence
   */
  constructor(presenceOptions: PresenceOptions);

  /**
   * Sets the activity shown in Discord
   * @param presenceData presenceData
   */
  setActivity(presenceData?: PresenceData): void;

  /**
   * Clears the activity shown in Discord
   */
  clearActivity(): void;

  /**
   * Subscribe to events emitted by Steemcord
   * @param eventName EventName to subscribe to
   * @param callback Callback function for event
   */
  on(eventName: 'richPresenceUpdate', callback: (data: SteamPresenceData) => void): void;
}

/**
 * The version of Steemcord that the presence is on.
 */
declare const STEEMCORD_VERSION: string;


// Polyfills for NodeJS, making installing the deps not needed
interface NodeModule {
  exports: unknown;
}
// eslint-disable-next-line no-var
declare var module: NodeModule;