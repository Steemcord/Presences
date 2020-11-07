interface PresenceData {
	state?: string;
	details?: string;
	startTimestamp?: number;
	endTimestamp?: number;
	largeImageKey?: string;
	largeImageText?: string;
	smallImageKey?: string;
  smallImageText?: string;
  partySize?: number;
  partyMax?: number;
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

interface PresenceMetadata {
  $schema?: string;
  app_id: number;
  name: string;
  altnames: Array<string>;
  version: string;
  icon?: string;
  author: PresenceAuthor;
  contributors?: Array<PresenceAuthor>;
  description?: string;
  settings?: Array<SettingMetadata>;
  update_url?: string;
  script_url?: string;
}

interface PresenceAuthor {
  name: string;
  avatar?: string;
  url?: string;
  github?: string;
}

interface BaseSetting {
  type: string,
  key: string,
  title: string;
  note?: string;
}

interface TextSetting extends BaseSetting {
  type: 'text',
  default: string;
  placeholder?: string;
  max_length?: number;
}

interface NumberSetting extends BaseSetting {
  type: 'number',
  default: number;
  min?: number;
  max?: number;
}

interface CheckboxSetting extends BaseSetting {
  type: 'checkbox',
  default: boolean;
}

interface DropdownSetting extends BaseSetting {
  type: 'dropdown',
  default: number;
  values: Array<string>;
}

type SettingMetadata = TextSetting | NumberSetting | CheckboxSetting | DropdownSetting;
type SettingType = string | number | boolean;

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
   * Gets the presence's metadata. This must be called after the 'ready' event.
   */
  getMetadata(): PresenceMetadata;

  /**
   * Gets a presence setting. This must be called after the 'ready' event.
   * @param key The key to the setting
   */
  getSetting(key: string): SettingType;

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
   * @param eventName Event name to subscribe to
   * @param callback Callback function for event
   */
  on(eventName: 'richPresenceUpdate', callback: (data: SteamPresenceData) => void): void;
  on(eventName: 'settingUpdate', callback: (key: string, value: SettingType) => void): void;
  on(eventName: 'ready', callback: (metadata: PresenceMetadata) => void): void;
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