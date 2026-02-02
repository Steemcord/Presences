const presence = new Presence({
  clientID: '1302209836821381150',
  module
});


presence.on('richPresenceUpdate', async steamPresence => {
  if (!steamPresence.presenceString) presence.clearActivity();

  let status = steamPresence.presenceString;

  const group = steamPresence.presence['steam_player_group_size'];
  const groupSize = Number(group || 1);


  switch (steamPresence.presenceString) {
    case '#Status_PlayingGame':
      status = 'In Match';
      break;
    case 'In Main Menu':
    case '#Status_MainMenu':
      status = 'In Menu';
      break;
    case 'Queuing':
    case '#Status_Queue':
      status = 'In Queue';
      break;
  }

  const presenceData: PresenceData = {
    largeImageKey: 'logo',
    state: status,
  };

  if (groupSize > 1) {
    presenceData.state = 'In Party';
    presenceData.partyMax = 5;
    presenceData.partySize = groupSize;
    presenceData.details = status;
  }

  if (!['In Menu'].includes(status)) {
    presenceData.startTimestamp = Date.now();
  }

  presence.setActivity(presenceData);
});