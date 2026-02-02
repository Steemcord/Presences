const presence = new Presence({
  clientID: '1264384396430147585',
  module
});

const GameModeIcons: { [key: string]: string } = {
  'Quick Play': 'quick_play',
  'Custom Game': 'custom_game',
  'Practice Vs AI': 'training',
  'Arcade': 'arcade',
  'Competitive': 'competitive',
  'Mystery Heroes': 'quick_play',
  'Deathmatch': 'quick_play',
  'Hero Mastery': 'hero_mastery',
  'Story Mission': 'story_mission',
  'Stadium': 'stadium',
  'Stadium Quick Play': 'stadium',
  'Stadium Competitive': 'stadium_competitive'
};

presence.on('richPresenceUpdate', async steamPresence => {
  if (!steamPresence.presenceString) presence.clearActivity();

  let icon = 'logo';
  const txt: string = steamPresence.presenceString;
  let state: string = steamPresence.presenceString;
  let details = '';

  if (txt && txt.includes(':')) {
    // Custom Game: In Lobby
    // Custom Game: In Game
    // Custom Game: Spectating
    const [gameMode, playerStateWithSpace] = txt.split(':');
    const playerState = playerStateWithSpace.trim();
    if (GameModeIcons[gameMode]) icon = GameModeIcons[gameMode];
    state = playerState;
    details = gameMode;
  } else if (txt && txt.length > 0) {
    switch (txt) {
      case 'In Menus':
        break;
      case 'In Practice Range':
      case 'Practice Range':
        icon = 'training';
        break;
      case 'In Tutorial':
        icon = 'training';
        break;
    }
  }

  switch (state) {
    case 'In Game':
      state = 'In Match';
      break;
    case 'Game Ending':
      state = 'Match Ending';
      break;
    case 'In Menus':
      state = 'In Menu';
      break;
  }
  const presenceData: PresenceData = {
    largeImageKey: icon,
    state: state || ''
  };
  if (details.length) {
    presenceData.largeImageText = details;
    presenceData.details = details;
  }
  const groupSize = Number(steamPresence?.presence?.steam_player_group_size || 1);
  const groupId = steamPresence?.presence?.steam_player_group;
  const defaultGroupMax = 5;
  if (groupId) {
    presenceData.partyId = groupId;
    presenceData.partySize = groupSize;
    presenceData.partyMax = groupSize > defaultGroupMax ? groupSize : 5;
    if (!details) {
      presenceData.state = 'In Group';
      presenceData.details = state;
    }
  }
  if (!['In Menu', 'Match Ending'].includes(state)) {
    presenceData.startTimestamp = Date.now();
  }
  if (icon !== 'logo') presenceData.smallImageKey = 'logo';

  if (state && state.length) presence.setActivity(presenceData);
  else presence.clearActivity();
});
