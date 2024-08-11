const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const leaguesDir = 'data/';
const reportsDir = 'reports/';

async function processLeagues() {
  let rawArrays = {};
  let report = {};
  let worldReport = {
    playerNumber: 0,
    plValue: [],
    plAge: [],
    plTOT: [],
    plATT: [],
    plTEC: [],
    plTAC: [],
    plDEF: [],
    plCRE: [],
    plRating: [],
    noATTR: [],
    noRating: []
  };
  try {
    const leagues = await fs.readdir(leaguesDir);
    //console.log('Leagues:', leagues);

    for (const league of leagues) {
      const leagueDir = path.join(leaguesDir, league);
      //console.log('League directory:', leagueDir);
      let rawLeague = tools.initArrays;
      const reportFilePath = path.join(reportsDir, league);
      await fs.mkdir(reportFilePath, { recursive: true });

      try {
        const teams = await fs.readdir(leagueDir);
        console.log('Teams in '+ league +': ', teams.length);

        for (const teamFile of teams) {
          const teamPath = path.join(leagueDir, teamFile);
          try {
            const teamData = JSON.parse(await fs.readFile(teamPath, 'utf8'));

            // Create team-specific raw data object with necessary properties
            let teamRaw = {
              plNumber: 0,
              plValue: [],
              plAge: [],
              plTOT: [],
              plATT: [],
              plTEC: [],
              plTAC: [],
              plDEF: [],
              plCRE: [],
              plRating: [],
              noATTR: [],
              noRating: []
            };
            
            rawLeague.teamFollowers.push(tools.convertToNumber(teamData.followers));
            rawLeague.stadium.push(teamData.stadium.capacity);

            for (let index = 0; index < teamData.roster.length; index++) {
              const player = teamData.roster[index];
              rawLeague.plNumber++;
              teamRaw.plNumber++;
              rawLeague.plValue.push(player.marketValue);
              teamRaw.plValue.push(player.marketValue);
              rawLeague.plAge.push(tools.calculateAge(player.dateOfBirth));
              teamRaw.plAge.push(tools.calculateAge(player.dateOfBirth));
              worldReport.plNumber++;
              worldReport.plValue.push(player.marketValue);
              worldReport.plAge.push(tools.calculateAge(player.dateOfBirth));
 
              if (player.attr.ATT) {
                const playerTotal = Number(player.attr.ATT) + Number(player.attr.TEC) + Number(player.attr.TAC) + Number(player.attr.DEF) + Number(player.attr.CRE);
                rawLeague.plTOT.push(playerTotal);
                teamRaw.plTOT.push(playerTotal);
                rawLeague.plATT.push(Number(player.attr.ATT));
                teamRaw.plATT.push(Number(player.attr.ATT));
                rawLeague.plTEC.push(Number(player.attr.TEC));
                teamRaw.plTEC.push(Number(player.attr.TEC));
                rawLeague.plTAC.push(Number(player.attr.TAC));
                teamRaw.plTAC.push(Number(player.attr.TAC));
                rawLeague.plDEF.push(Number(player.attr.DEF));
                teamRaw.plDEF.push(Number(player.attr.DEF));
                rawLeague.plCRE.push(Number(player.attr.CRE));
                teamRaw.plCRE.push(Number(player.attr.CRE));
                worldReport.plTOT.push(playerTotal);
                worldReport.plATT.push(Number(player.attr.ATT));
                worldReport.plTEC.push(Number(player.attr.TEC));
                worldReport.plTAC.push(Number(player.attr.TAC));
                worldReport.plDEF.push(Number(player.attr.DEF));
                worldReport.plCRE.push(Number(player.attr.CRE));
              } else {
                rawLeague.noATTR.push(Number(player.id));
                teamRaw.noATTR.push(Number(player.id));
                worldReport.noATTR.push(Number(player.id));
              }

              if (player.attr.rating) {
                rawLeague.plRating.push(Number(player.attr.rating));
                teamRaw.plRating.push(Number(player.attr.rating));
                worldReport.plRating.push(Number(player.attr.rating));
              } else {
                rawLeague.noRating.push(Number(player.id));
                teamRaw.noRating.push(Number(player.id));
                worldReport.noRating.push(Number(player.id));
              }
            }
            // Generate team report using team-specific raw data
            const teamReport = tools.getReport(teamRaw);

            // Write team report to JSON file within league directory
            const teamReportFileName = teamData.abbr + '-' + teamData.id + '.json'
            const teamJsonFilePath = path.join(reportFilePath, teamReportFileName);
            console.log(teamData.name + ' report written: ' + teamReportFileName)
            await fs.writeFile(teamJsonFilePath, JSON.stringify(teamReport, null, 2));
          } catch (error) {
            console.error(`Error parsing team file ${teamFile}:`, error);
          }
        }

        // Calculate min, max, and middle for the league
      } catch (error) {
        console.error(`Error reading teams for league ${league}:`, error);
      }

      // Generate and write league report
      let leagueReport = tools.getReport(rawLeague);
      const jsonFilePath = path.join(reportFilePath, league + '.json');
      console.log(league + ' report written: ' + league + '.json')
      await fs.writeFile(jsonFilePath, JSON.stringify(leagueReport, null, 2));
    }
     // Calculate world report
     const worldReportData = tools.getReport(worldReport);

     // Write world report to JSON file
     const worldReportPath = path.join(reportsDir, 'world.json');
     await fs.writeFile(worldReportPath, JSON.stringify(worldReportData, null, 2));
    console.log('WORLD REPORT GENERATED');
     //console.log('Final result:', report);
    //console.log('Final result:', report);
  } catch (error) {
    console.error('Error processing leagues:', error);
  }
}

processLeagues();
