const presence = new Presence({
  clientID: '471773803689541644',
  module
});

let lastTimestamp = 0,
  lastState: string = null;

function checkState(state: string) {
  if (lastState !== state) {
    lastState = state;
    lastTimestamp = Date.now();
  }
}

const Maps: { [key: string]: string } = {\
  ar_dizzy: 'Dizzy',
  ar_lunacy: 'Lunacy',
  ar_monastery: 'Monastery',
  ar_shoots: 'Shoots',
  cs_agency: 'Agency',
  cs_assault: 'Assault',
  cs_insertion: 'Insertion',
  cs_italy: 'Italy',
  cs_militia: 'Militia',
  cs_office: 'Office',
  de_anubis: 'Anubis',
  de_austria: 'Austria',
  de_ancient: 'Ancient',
  de_bank: 'Bank',
  de_cache: 'Cache',
  de_canals: 'Canals',
  de_cbble: 'Cobblestone',
  de_chlorine: 'Chlorine',
  de_dust2: 'Dust II',
  de_engage: 'Engage',
  de_inferno: 'Inferno',
  de_lake: 'Lake',
  de_mirage: 'Mirage',
  de_mutiny: 'Mutiny',
  de_nuke: 'Nuke',
  de_overpass: 'Overpass',
  de_safehouse: 'Safehouse',
  de_shipped: 'Shipped',
  de_shortdust: 'Shortdust',
  de_shortnuke: 'Shortnuke',
  de_stmarc: 'St. Marc',
  de_sugarcane: 'Sugarcane',
  de_swamp: 'Swamp',
  de_train: 'Train',
  de_vertigo: 'Vertigo',
  dz_blacksite: 'Blacksite',
  dz_frostbite: 'Frostbite',
  dz_junglety: 'Jungle',
  dz_sirocco: 'Sirocco',
  gd_rialto: 'Rialto',
}

const GameModeNames: { [key: string]: string } = {
  competitive: 'Competitive',
  scrimcomp2v2: 'Wingman',
  casual: 'Casual',
  deathmatch: 'Deathmatch',
  skirmish: 'War Games',
  survival: 'Danger Zone',
  coopmission: 'Co-op Mission',
  cooperative: 'Co-op',
}

const SkirmishNames: { [key: string]: string } = {
  mg_skirmish_flyingscoutsman: 'Flying Scoutsman',
  mg_skirmish_armsrace: 'Arms Race',
  mg_skirmish_demolition: 'Demolition',
  mg_skirmish_retakes: 'Retakes',
}

presence.on('richPresenceUpdate', async data => {
  if (!data.presenceString) presence.clearActivity();

  // Main Menu
  if (data.presence.steam_display === '#display_Menu') {
    checkState('menu');
    presence.setActivity({
      largeImageKey: 'csgo',
      state: 'Main Menu',
    });
  // Lobby
  } else if (data.presence.steam_display.startsWith('#display_Lobby')) {
    checkState('lobby');
    const mode = GameModeNames[data.presence['game:mode']] || data.presence['game:mode'];
    let groupName = 'map';
    let groupCount = data.presence['game:mapgroupname'].split(',').length;
    if (data.presence['game:mode'] === 'skirmish')
       groupName = 'map group';
    else if (data.presence['game:mode'] === 'survival' || data.presence['game:mode'] === 'deathmatch' || data.presence['game:mode'] === 'casual')
       groupName = null;
    const presenceData: PresenceData = {
      largeImageKey:'csgo',
      state: `In a ${mode} Lobby`,
      details: `Selected ${groupCount} map${groupCount === 1 ? '' : 's'}`,
    };
    if (!groupName) delete presenceData.details;
    presence.setActivity(presenceData);
  // Spectating
  } else if (data.presence.steam_display.startsWith('#display_Watch')) {
    checkState('watch');
    const map = Maps[data.presence['game:map']];
    const mode = GameModeNames[data.presence['game:mode']] || data.presence['game:mode'];
    const skirmishMode = (data.presence['game:mapgroupname'] && data.presence['game:mode'] === 'skirmish' && SkirmishNames[data.presence['game:mapgroupname']])
      ? SkirmishNames[data.presence['game:mapgroupname']] : null;
    const presenceData: PresenceData = {
      largeImageKey: map ? data.presence['game:map'] : 'csgo_unknown',
      largeImageText: map || data.presence['game:map'],
      state: `Watching a ${mode} game`,
    };
    if (skirmishMode)
      presenceData.details = `${map}: ${skirmishMode} ${data.presence['game:score'] || ''}`;
    presence.setActivity(presenceData);
  // Game: Known Map
  } else if (data.presence.steam_display.startsWith('#display_GameKnownMap') || data.presence.steam_display.startsWith('#display_GameWkshpMap')) {
    checkState('game');
    const map = Maps[data.presence['game:map']];
    const mode = GameModeNames[data.presence['game:mode']] || data.presence['game:mode'];
    const isWorkshop = data.presence.steam_display.includes('Wkshp');
    const skirmishMode = (data.presence['game:mapgroupname'] && data.presence['game:mode'] === 'skirmish' && SkirmishNames[data.presence['game:mapgroupname']])
      ? SkirmishNames[data.presence['game:mapgroupname']] : null;
    const presenceData: PresenceData = {
      largeImageKey: map ? data.presence['game:map'] : 'csgo_unknown',
      largeImageText: map || data.presence['game:map'].split('/').reverse()[0],
      state: `Playing ${mode}`,
      details: map,
      startTimestamp: lastTimestamp
    };
    if (data.presence.steam_display.endsWith('Score'))
      presenceData.details = `${isWorkshop ? 'Workshop Map' : (map || '')} ${data.presence['game:score']}`;
    if (skirmishMode)
      presenceData.details = `${map}: ${skirmishMode} ${data.presence['game:score'] || ''}`;
    presence.setActivity(presenceData);
  // Fallback
  } else presence.setActivity({
      largeImageKey: 'logo',
      state: data.presenceString || 'Starting'
    });
});