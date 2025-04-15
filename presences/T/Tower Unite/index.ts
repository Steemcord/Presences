const presence = new Presence({
  clientID: '773428971777294337',
  module
});

let lastTimestamp = 0;
let lastGameWorld: string = null;
let wasWaiting = false;

const Condos: { [key: string]: string } = {
  House: 'House',
  Condo: 'Condo',
  'S. Dirt': 'Smooth Dirt',
  Suite: 'Suite',
  Underwater: 'Underwater',
  Highrise: 'Highrise',
  'A. Studio': 'Art Studio',
  Theater: 'Theater',
  Resort: 'Resort',
  Playground: 'Item Playground',
};

const MinigolfMaps: { [key: string]: [string, Array<string>] } = {
  Island: ['Island', [
    'Gradual Incline',
    'Shallow Dip',
    'Tedious Fall',
    'Middle Aim',
    'Squiggles',
    'Hazardous Hills',
    'Bumpy Road',
    'Steps',
    'Back Around',
    'Pitfall',
    'Cross the Gap',
    'Mind the Gap',
    'Decisions',
    'Vortex',
    'Sidewinder',
    'The High Road',
    'Perfect Timing',
    'Plinko'
  ]],
  Kingdom: ['Kingdom', [
    'To the Left',
    'Straight Down The Middle',
    'Rock Slide',
    'Up, Down, and Around',
    'Hopping the River',
    'Backward Bounce',
    'This Way or That Way',
    'Into the Lake',
    'Over and Under',
    'Bridge Cross',
    'Stair Jump',
    'Carnival Wheel',
    'The Shortcut',
    'Prepare for Disappointment',
    'The Weed-Out Course',
    'The Throne',
    'Turnin\' Up the Heat',
    'Follow The Light'
  ]],
  Waterhole: ['Waterhole', [
    'It\'s All Downhill From Here',
    'Over and Under',
    'Waterwheel',
    'There\'s A Bull In My Eye', 
    'Don\'t Make Me Turn This Car Around',
    'The Snake',
    'Bridge to Nowhere',
    'Barrel Drive Through',
    'The Long Haul',
    'Curveball',
    'Comeback',
    'Take A Swing At It',
    'Around Town',
    'One Stop Drop',
    'Spelunking',
    'Zigzagonal',
    'Rolling Barrels',
    'Minecart Journey'
  ]],
  Forest: ['Forest', [
    'Just Some Bumps',
    'The Slope is Real',
    'Peaks and Valleys',
    'Parting Ways',
    'Sidetracked',
    'Staircase Shenanigans',
    'Creek Jump',
    'The Drop Off',
    'Zipline',
    'Helter Skelter',
    'Sorting Line',
    'Roundabout',
    'Mills n\' Gutters',
    'Reverse Staircase Shenanigans',
    'Rollin\' in the Deep',
    'A Helping Hand',
    'Tumble to the Top',
    'Funnels to Glory'
  ]],
  'S. Tooth': ['Sweet Tooth', [
    'Winding Forest',
    'Trick Shot',
    'Twist, Turn, and Climb',
    'Keep to the Sides',
    'Chocolate Pit',
    'Up or Down',
    'Chocolate Roulette',
    'Skee Ball',
    'Ricochet',
    'Up and Under',
    'Overpass',
    'River Crossing',
    'Vortex Run',
    'Loop-de-Loop',
    'Revenge of the Chocolate Pit!',
    'Chutes and Failures',
    'There and Back',
    'Sweet Tooth World Tour'
  ]],
  'T. Cove': ['Treasure Cove', [
    'Lighthouse Bend',
    'Cliff Excursion',
    'Swashbuckle Switchback',
    'Enjoy the View',
    'A Leap of Faith',
    'Wheely Insane',
    'Digging For Treasure',
    'Cannons 101',
    'Perfect Timing',
    'Boarding Party',
    'Ship Duel',
    'Abandon Ship',
    'Through The Loop',
    'The Split Up',
    'Ride The Wave',
    'A Barrel For Your Thoughts',
    'Lagoon Dessert',
    '\'X\' Marks the Spot'
  ]],
  Emission: ['Emission', [
    'Pinpoint',
    'Rainbow Cloud',
    'Speed Bump',
    'Dead End',
    'Red vs Blue',
    'Laser Bridge',
    'Diversion',
    'Curve Ball',
    'Crossroads',
    'Laser Highway',
    'Choke Point',
    'Cutting It Close',
    'Something\'s Not Right...',
    'Reflection',
    'Following the Curve',
    'Over The Hill',
    'Phaser',
    'Anomaly'
  ]],
  Alpine: ['Alpine', [
    'Golf: The Musical - On Ice!',
    'Natural Bridge',
    'Dam Crossing',
    'Over & Under',
    'Break the Ice',
    'The Bends',
    'Curling',
    'Out & In',
    'Moguls',
    'Rabbit Hole',
    'Spelunker',
    'Have an Ice Trip',
    'Ice Approach',
    'Smash Hit',
    'Mind the Edge',
    'Slippery Slope',
    'Cold Shoulder',
    'Winners & Luge-rs'
  ]],
  Altitude: ['Altitude', [
    'Flying Lessons',
    'No Indication',
    'Nature\'s Journey',
    'Cloudy Hills',
    'Air Ship Blockade',
    'Taxiway',
    'Uphill Struggle',
    'Aerobatics',
    'Diversion',
    'End of the Runway',
    'Takeoff',
    'Turbulence',
    'Around the World',
    'Cross Winds',
    'Go East',
    'Crash Landing',
    'Glide',
    'Cross Winds'
  ]],
  Garden: ['Garden', [
    'Bridge Crossing',
    'Split Up',
    'Going In Circles',
    'Taiko Bounce',
    'Storm the Castle',
    'Mind The Gap',
    'Whirlybird',
    'Gong Smash',
    'Funnel Your Thoughts',
    'Winding Roads',
    'Taiko Mixup',
    'Around The Bend',
    'Up & Over',
    'Speed Bump',
    'Split Decision',
    'Love Tap',
    'Plinko',
    'Dragon\'s Tail'
  ]],
};

const LCMaps: { [key: string]: string } = {
  Knightsend: 'Knightsend-by-sea',
  // This can either be Toy Room or Throne Room /shrug
  // 'T. Room': 'Toy Room',
  'T. Room': 'Throne Room',
  Market: 'Market',
  Amphitheatre: 'Amphitheatre',
};

const BallRaceMaps: { [key: string]: string } = {
  Woodlands: 'Woodlands',
  'E. Horizon': 'Event Horizon',
  Oasis: 'Oasis',
  Khromidro: 'Khromidro',
  Prism: 'Prism',
  Summit: 'Summit',
  GLXY: 'GLXY',
  Paradise: 'Paradise',
  Nimbus: 'Nimbus',
  Midori: 'Midori',
  Memories: 'Memories',
};

const VirusMaps: { [key: string]: string } = {
  Solar: 'Solar',
  Subway: 'Subway',
  Overtime: 'Overtime',
  Hospital: 'Hospital',
  Desertion: 'Desertion',
};

const ZMMaps: { [key: string]: string } = {
  Compound: 'Compound',
  Gasoline: 'Gasoline',
  Nightyard: 'Nightyard',
  Trainyard: 'Trainyard',
  Village: 'Village',
};

const AccelerateMaps: { [key: string]: string } = {
  'S. Isles': 'Sunrise Isles',
  Bedzoom: 'Bedzoom',
  'P. Valley': 'Pine Valley',
};

function waitingForRound(data: SteamPresenceData, allowRoundZero = false) {
  const result = data.presence.steam_display === '#Waiting' 
    || !data.presence.round
    || (allowRoundZero ? false : data.presence.round === '0');
  if (!wasWaiting && result) wasWaiting = true;
  else if (wasWaiting && !result) {
     wasWaiting = false;
     lastTimestamp = Date.now();
  }
  return result;
}

function filterMap(map: string, prefix: string) {
  return map ? prefix + 'map_' + map.toLowerCase().replace(/ /g, '') : 'logo';
}

function ensureOne(round: string) {
  return (!round || round === '0') ? '1' : round;
}

presence.on('richPresenceUpdate', async data => {
  if (!data.presenceString) presence.clearActivity();
  if (data.presence.gameWorld && data.presence.gameWorld !== lastGameWorld) {
    lastTimestamp = Date.now();
    lastGameWorld = data.presence.gameWorld;
  }

  // Main Menu
  if (data.presence.gamemode === 'MainMenu') {
    const presenceData: PresenceData = {
      largeImageKey: 'logo',
      state: 'Main Menu',
    };
    if (data.presence.status === 'In Workshop Editor') {
      presenceData.smallImageKey = 'workshop';
      presenceData.smallImageText = 'Workshop Editor';
      presenceData.state = 'In Workshop Editor';
    }
    presence.setActivity(presenceData);
  // Lobby/Plaza
  } else if (data.presence.gamemode === 'Lobby') {
    const presenceData: PresenceData = {
      largeImageKey: 'map_plaza',
      largeImageText: 'Plaza',
      smallImageKey: 'plaza',
      smallImageText: 'Plaza',
      state: 'In the Plaza'
    };
    if (presence.getSetting('showservername') && data.presence.servername !== 'Unknown')
        presenceData.details = data.presence.servername;
    if (data.presence.status === 'In Game Ports') {
      presenceData.smallImageKey = 'gameports';
      presenceData.smallImageText = 'Game World Ports';
      presenceData.details = 'At Game World Ports';
    }
    presence.setActivity(presenceData);
  // Condo
  } else if (data.presence.gamemode === 'Condo') {
    const condo = Condos[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(condo, 'condo'),
      largeImageText: condo || data.presence.Map,
      smallImageKey: 'condo',
      smallImageText: 'Condo',
      state: 'In a Condo',
      startTimestamp: lastTimestamp
    };
    if (data.presence.Map === 'Playground') {
      presenceData.smallImageKey = 'itemplayground';
      presenceData.smallImageText = 'Item Playground';
      presenceData.state = 'In the Item Playground';
    }

    presence.setActivity(presenceData);
  // Minigolf
  } else if (data.presence.gameWorld === 'MiniGolf') {
    const mgdata = MinigolfMaps[data.presence.Map];
    const mgmap = mgdata ? mgdata[0] : null;
    const mgholes = mgdata ? mgdata[1] : null;
    const presenceData: PresenceData = {
      largeImageKey: filterMap(mgmap, 'mg'),
      largeImageText: mgmap || data.presence.Map,
      smallImageKey: 'minigolf',
      smallImageText: 'Minigolf',
      state: 'Playing Minigolf: ' + (mgmap || data.presence.Map),
    };
    if (waitingForRound(data))
      presenceData.details = 'Waiting for players';
    else {
      presenceData.startTimestamp = lastTimestamp;
      if (presence.getSetting('showgolfhole') && data.presence.round !== '0') {
        presenceData.details = `Hole ${data.presence.round}`;
        const hole = parseInt(data.presence.round);
        if (mgholes && mgholes[hole - 1])
          presenceData.details += `: ${mgholes[hole - 1]}`;
      }
    }
    presence.setActivity(presenceData);
  // Little Crusaders
  } else if (data.presence.gameWorld === 'LittleCrusaders') {
    const lcmap = LCMaps[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(lcmap, 'lc'),
      largeImageText: lcmap || data.presence.Map,
      smallImageKey: 'littlecrusaders',
      smallImageText: 'Little Crusaders',
      state: 'Playing Little Crusaders: ' + (lcmap || data.presence.Map),
      details: `Round ${ensureOne(data.presence.round)}/${data.presence.maxRound}`
    };
    if (waitingForRound(data))
      presenceData.details = 'Waiting for players';
    else presenceData.startTimestamp = lastTimestamp;
    presence.setActivity(presenceData);
  // Ball Race
  } else if (data.presence.gameWorld === 'BallRace') {
    const brmap = BallRaceMaps[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(brmap, 'br'),
      largeImageText: brmap || data.presence.Map,
      smallImageKey: 'ballrace',
      smallImageText: 'Ballrace',
      state: 'Playing Ballrace: ' + (brmap || data.presence.Map),
      details: `Level ${data.presence.round}/${data.presence.maxRound}`
    };
    if (waitingForRound(data))
      presenceData.details = 'Waiting for players';
    else presenceData.startTimestamp = lastTimestamp;
    presence.setActivity(presenceData);
  // Virus
  } else if (data.presence.gameWorld === 'Virus') {
    const vmap = VirusMaps[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(vmap, 'v'),
      largeImageText: vmap || data.presence.Map,
      smallImageKey: 'virus',
      smallImageText: 'Virus',
      state: 'Playing Virus: ' + (vmap || data.presence.Map),
      details: `Round ${ensureOne(data.presence.round)}/${data.presence.maxRound}`
    };
    if (waitingForRound(data, true))
      presenceData.details = 'Waiting for players';
    else presenceData.startTimestamp = lastTimestamp;
    presence.setActivity(presenceData);
  // Zombie Massacre
  } else if (data.presence.gameWorld === 'ZombieMassacre') {
    const zmmap = ZMMaps[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(zmmap, 'zm'),
      largeImageText: zmmap || data.presence.Map,
      smallImageKey: 'zombiemassacre',
      smallImageText: 'Zombie Massacre',
      state: 'Playing Zombie Massacre: ' + (zmmap || data.presence.Map),
      details: `Day ${ensureOne(data.presence.round)} out of ${data.presence.maxRound}`
    };
    if (waitingForRound(data, true))
      presenceData.details = 'Waiting for players';
    else presenceData.startTimestamp = lastTimestamp;
    presence.setActivity(presenceData);
  // Accelerate
  } else if (data.presence.gameWorld === 'Accelerate') {
    const amap = AccelerateMaps[data.presence.Map];
    const presenceData: PresenceData = {
      largeImageKey: filterMap(amap, 'a'),
      largeImageText: amap || data.presence.Map,
      smallImageKey: 'accelerate',
      smallImageText: 'Accelerate',
      state: 'Playing Accelerate: ' + (amap || data.presence.Map),
      details: `Course ${ensureOne(data.presence.round)} of ${data.presence.maxRound}` +
        (data.presence.lap !== undefined && data.presence.maxLap
          ? ` (Lap ${data.presence.lap}/${data.presence.maxLap})` : '')
    };
    if (waitingForRound(data, true))
      presenceData.details = 'Waiting for players';
    else presenceData.startTimestamp = lastTimestamp;
    presence.setActivity(presenceData);
  // Fallback
  } else presence.setActivity({
      largeImageKey: 'logo',
      state: data.presenceString || 'Starting'
    });
});