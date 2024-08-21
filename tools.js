const calculateStats = require('./statsLIB')

function convertToNumber(str) {
    // Remove any commas from the string
    str = str.replace(",", "");
  
    // Check if the string ends with "k" or "M"
    const lastChar = str.charAt(str.length - 1);
    let number;
  
    if (lastChar === "k") {
      // Convert the string to a number and multiply by 1000
      number = parseFloat(str.substring(0, str.length - 1)) * 1000;
    } else if (lastChar === "M") {
      // Convert the string to a number and multiply by 1,000,000
      number = parseFloat(str.substring(0, str.length - 1)) * 1000000;
    } else {
      // If the string doesn't end with "k" or "M", assume it's a plain number
      number = parseFloat(str);
    }
  
    return number;
  }
  
  function formatNumber(number) {
    // Check if the number is greater than or equal to 1 million
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      // Check if the number is greater than or equal to 1 thousand
      return (number / 1000).toFixed(1) + "k";
    } else {
      // If the number is less than 1 thousand, return it as is
      return number.toString();
    };
  };
  
  function calculateAge(birthdate) {
    // If birthdate is a timestamp in seconds, convert it to milliseconds
    if (typeof birthdate === 'number' && birthdate < 10000000000) {
        birthdate *= 1000;  // Convert seconds to milliseconds
    }

    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

const rawInit = {
  plValue:  {G : [], D : [], M : [], F : [], TOT : []},
  plAge:    {G : [], D : [], M : [], F : [], TOT : []},
  TOT:      {G : [], D : [], M : [], F : [], TOT : []},
  ATT:      {G : [], D : [], M : [], F : [], TOT : []},
  TEC:      {G : [], D : [], M : [], F : [], TOT : []},
  TAC:      {G : [], D : [], M : [], F : [], TOT : []},
  DEF:      {G : [], D : [], M : [], F : [], TOT : []},
  CRE:      {G : [], D : [], M : [], F : [], TOT : []},
  rating:   {G : [], D : [], M : [], F : [], TOT : []},
  plcounts: {
    total:    {G: 0,  D: 0,  M: 0,  F:  0},
    noATTR:   {G : 0, D : 0, M : 0, F : 0},
    noPrice: {G : 0, D : 0, M : 0, F : 0},
    complete: {G : 0, D : 0, M : 0, F : 0},
    noRole: 0,
    byTeam: {}
  },
  coachAge : [],
  coach: {
    "total": [],
    "pointsXGame": [],
    "goalsXGame": [],
    "concededXGame": []
  }
};

const getReport = (rawData) => {
  let report ={...rawInit}
  for (const [stat, roleObj] of Object.entries(rawData)) {
    //console.log(`Key: ${stat}, Value: ${roleObj}`);
    if (stat == 'plcounts'){
      report.plcounts = rawData.plcounts;
      continue ;
    };
    if (stat == 'coachAge') {
      report.coachAge = calculateStats(rawData.coachAge);
      continue ;
    }
    if (stat == 'coach') {
      console.log('******   REPORTING COACH', rawData.coach)
      report.coach.total = calculateStats(rawData.coach.total)
      report.coach.pointsXGame = calculateStats(rawData.coach.pointsXGame)
      report.coach.goalsXGame = calculateStats(rawData.coach.goalsXGame)
      report.coach.concededXGame = calculateStats(rawData.coach.concededXGame)
      continue ;
    }
    for (let i = 0; i < ['G', 'D', 'M', 'F', 'TOT'].length; i++) {
      const role = ['G', 'D', 'M', 'F', 'TOT'][i];
      console.log('REPORTING ', stat, role);
      console.log(rawData[stat])
      report[stat][role] = calculateStats(rawData[stat][role])
    }
  }
  return report;
 };

function findQ(arr, num) {
 for (let i = 0; i < arr.length; i++) {
   if (arr[i] >= num) {
     return i;
   }
 }
 return arr.length;
}

function lottery(tickets) {
  if (tickets.length === 0) {
      return null;  // Return null if the array is empty
  }

  const totalTickets = tickets.reduce((acc, num) => acc + num, 0);
  const winnerTicket = Math.floor(Math.random() * totalTickets) + 1;

  let currentSum = 0;
  for (let i = 0; i < tickets.length; i++) {
      currentSum += tickets[i];
      if (winnerTicket <= currentSum) {
          return i;
      }
  }
}

const countFaces = (die, act) => {
  let arr =[];
  for (let index = 0; index < die.length; index++) {
    const face = die[index];
    if (face.act == act) {
      arr.push(index);
    };
  };
  return arr;
}

  module.exports = {
    convertToNumber,
    formatNumber,
    calculateAge,
    getReport,
    findQ,
    lottery,
    countFaces,
    rawInit
  };
  
  playerAbilities = [
    'Positioning',       'High pressing',
    'Playmaking',        'Long shots',
    'Long balls',        'Ground duels',
    'Aerial duels',      'Tackling',
    'Penalty taking',    'Finishing',
    'Passing',           'Consistency',
    'Long shots saving', 'High claims',
    'Anchor play',       'Ball control',
    'Reflexes',          'Direct free kicks',
    'Penalty saving',    'Handling',
    'Runs out',          'Ball interception'
  ];
Roles =  [
  'ST', 'LW', 'AM',
  'MC', 'DM', 'RW',
  'MR', 'DR', 'DC',
  'DL', 'ML', 'GK'
];

tactics = {
  "3-5-2": {
    "GK": "GK",
    "Defenders": ["DC", "DC", "DC"],
    "Midfielders": ["ML", "MC", "DM", "MC", "MR"],
    "Forwards": ["ST", "ST"]
  },
  "3-4-3": {
    "GK": "GK",
    "Defenders": ["DC", "DC", "DC"],
    "Midfielders": ["ML", "MC", "MC", "MR"],
    "Forwards": ["LW", "ST", "RW"]
  },
  "4-4-2": {
    "GK": "GK",
    "Defenders": ["DL", "DC", "DC", "DR"],
    "Midfielders": ["ML", "MC", "MC", "MR"],
    "Forwards": ["ST", "ST"]
  },
  "4-3-3": {
    "GK": "GK",
    "Defenders": ["DL", "DC", "DC", "DR"],
    "Midfielders": ["MC", "DM", "MC"],
    "Forwards": ["LW", "ST", "RW"]
  },
  "5-3-2": {
    "GK": "GK",
    "Defenders": ["DL", "DC", "DC", "DC", "DR"],
    "Midfielders": ["MC", "DM", "MC"],
    "Forwards": ["ST", "ST"]
  },
  "5-4-1": {
    "GK": "GK",
    "Defenders": ["DL", "DC", "DC", "DC", "DR"],
    "Midfielders": ["ML", "MC", "MC", "MR"],
    "Forwards": ["ST"]
  }
}
