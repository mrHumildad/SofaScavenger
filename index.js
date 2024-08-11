const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const calculateStats = require('./statsLIB')

const leaguesDir = 'data/';

async function processLeagues() {
  let rawArrays = {};
  let report = {};
  try {
    const leagues = await fs.readdir(leaguesDir);
    //console.log('Leagues:', leagues);

    for (const league of leagues) {
      const leagueDir = path.join(leaguesDir, league);
      //console.log('League directory:', leagueDir);
      rawArrays[league] = {
        teamFollowers: [],
        stadium: [],
        plValue : [],
        plAge: [],
        plATT: [],
        plTEC: [],
        plTAC: [],
        plDEF: [],
        plCRE: [],
        plTOT: [],
        plRating: []
      };
      //console.log(rawArrays)
      try {
        const teams = await fs.readdir(leagueDir);
        console.log('Teams in league:', teams.length);

       for (const teamFile of teams) {
          const teamPath = path.join(leagueDir, teamFile);
          //console.log('Team file:', teamPath);
          try {
            const teamData = JSON.parse(await fs.readFile(teamPath, 'utf8'));
            //console.log('Team data:', teamData.name, teamData.followers);   
            rawArrays[league].teamFollowers.push(tools.convertToNumber(teamData.followers));
            rawArrays[league].stadium.push(teamData.stadium.capacity);
            for (let index = 0; index < teamData.roster.length; index++) {
              const player = teamData.roster[index];
              rawArrays[league].plValue.push(player.marketValue);
              rawArrays[league].plAge.push(tools.calculateAge(player.dateOfBirth));
              if (player.attr.ATT) {
                const playerTotal = Number(player.attr.ATT) + Number(player.attr.TEC) + Number(player.attr.TAC) + Number(player.attr.DEF) + Number(player.attr.CRE);
                rawArrays[league].plTOT.push(playerTotal);
                rawArrays[league].plATT.push(Number(player.attr.ATT));
                rawArrays[league].plTEC.push(Number(player.attr.TEC));
                rawArrays[league].plTAC.push(Number(player.attr.TAC));
                rawArrays[league].plDEF.push(Number(player.attr.DEF));
                rawArrays[league].plCRE.push(Number(player.attr.CRE));
              };
              if (player.attr.rating) {
                rawArrays[league].plRating.push(Number(player.attr.rating));
                
              }
            }
          } catch (error) {
            console.error(`Error parsing team file ${teamFile}:`, error);
          };
        };
        // Calculate min, max, and middle for the league
      } catch (error) {
        console.error(`Error reading teams for league ${league}:`, error);
      }
      //console.log(rawArrays)
      report[league] = {
        teamFollowers: calculateStats(rawArrays[league].teamFollowers),
        stadiumCapacity: calculateStats(rawArrays[league].stadium),
        playerValue: calculateStats(rawArrays[league].plValue),
        playerAge: calculateStats(rawArrays[league].plAge),
        playerATT: calculateStats(rawArrays[league].plATT),
        playerTEC: calculateStats(rawArrays[league].plTEC),
        playerTAC: calculateStats(rawArrays[league].plTAC),
        playerDEF: calculateStats(rawArrays[league].plDEF),
        playerCRE: calculateStats(rawArrays[league].plCRE),
        playerTOT: calculateStats(rawArrays[league].plTOT),
        playerRating: calculateStats(rawArrays[league].plRating),
      };
    };
    console.log('Final result:', report);
  } catch (error) {
    console.error('Error processing leagues:', error);
  }
  
}

processLeagues();
