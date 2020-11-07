const presence = new Presence({
  clientID: '773428971777294337',
  module
});

presence.on('richPresenceUpdate', async data => {
  // Pushing this out for now to test workflows
  // Retry number 1
  presence.setActivity({
    largeImageKey: 'logo',
    state: data.presence.status || 'N/A',
  });
});