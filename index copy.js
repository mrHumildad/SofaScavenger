const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const leaguesDir = 'data/';
const reportsDir = 'reports/';

async function processLeagues() {
  
  let worldRaw = {...tools.rawInit};
  try {
    const leagues = await fs.readdir(leaguesDir);
    console.log('Leagues found:', leagues.lenght);
    for (const league of leagues) {
      const leagueDir = path.join(leaguesDir, league);
      console.log('League analize => ', leagueDir);
      let rawLeague = {...tools.rawInit};
      const reportFilePath = path.join(reportsDir, league);
      await fs.mkdir(reportFilePath, { recursive: true });
      try {
        const teams = await fs.readdir(leagueDir);
        console.log('Teams in '+ league +': ', teams.length);
        for (const teamFile of teams) {
          const teamPath = path.join(leagueDir, teamFile);
          try {
            const teamData = JSON.parse(await fs.readFile(teamPath, 'utf8'));
            console.log('Analizing team ', teamData.name, teamData.id)
            // Create team-specific raw data object with necessary properties
            let teamRaw = {...tools.rawInit}
            //rawLeague.teamFollowers.push(tools.convertToNumber(teamData.followers));
            //rawLeague.stadium.push(teamData.stadium.capacity);

            for (let index = 0; index < teamData.roster.length; index++) {
              const player = teamData.roster[index];
              rawLeague.plNumber[player.position]++;
              teamRaw.plNumber[player.position]++;
              rawLeague.plValue[player.position].push(player.marketValue);
              teamRaw.plValue[player.position].push(player.marketValue);
              rawLeague.plAge[player.position].push(tools.calculateAge(player.dateOfBirth));
              teamRaw.plAge[player.position].push(tools.calculateAge(player.dateOfBirth));
              //console.log('PLAYER ROLE: ' + player.position)
              worldRaw.plNumber[player.position]++;
              worldRaw.plValue[player.position].push(player.marketValue);
              worldRaw.plAge[player.position].push(tools.calculateAge(player.dateOfBirth));
              
              if (player.attr.ATT) {
                const playerTotal = (Number(player.attr.ATT) + Number(player.attr.TEC) + Number(player.attr.TAC) + Number(player.attr.DEF) + Number(player.attr.CRE));
                rawLeague.plTOT[player.position].push(playerTotal);
                teamRaw.plTOT[player.position].push(playerTotal);
                rawLeague.plATT[player.position].push(Number(player.attr.ATT));
                teamRaw.plATT[player.position].push(Number(player.attr.ATT));
                rawLeague.plTEC[player.position].push(Number(player.attr.TEC));
                teamRaw.plTEC[player.position].push(Number(player.attr.TEC));
                rawLeague.plTAC[player.position].push(Number(player.attr.TAC));
                teamRaw.plTAC[player.position].push(Number(player.attr.TAC));
                rawLeague.plDEF[player.position].push(Number(player.attr.DEF));
                teamRaw.plDEF[player.position].push(Number(player.attr.DEF));
                rawLeague.plCRE[player.position].push(Number(player.attr.CRE));
                teamRaw.plCRE[player.position].push(Number(player.attr.CRE));
                worldRaw.plTOT[player.position].push(playerTotal);
                worldRaw.plATT[player.position].push(Number(player.attr.ATT));
                worldRaw.plTEC[player.position].push(Number(player.attr.TEC));
                worldRaw.plTAC[player.position].push(Number(player.attr.TAC));
                worldRaw.plDEF[player.position].push(Number(player.attr.DEF));
                worldRaw.plCRE[player.position].push(Number(player.attr.CRE));
              } else {
                //rawLeague.noATTR[player.position].push(Number(player.id));
                //teamRaw.noATTR[player.position].push(Number(player.id));
                //worldRaw.noATTR[player.position].push(Number(player.id));
              }

              if (player.attr.rating) {
                rawLeague.plRating[player.position].push(Number(player.attr.rating));
                teamRaw.plRating[player.position].push(Number(player.attr.rating));
                worldRaw.plRating[player.position].push(Number(player.attr.rating));
              } else {
                /* rawLeague.noRating[player.position].push(Number(player.id));
                teamRaw.noRating[player.position].push(Number(player.id));
                worldRaw.noRating[player.position].push(Number(player.id)); */
              }
            }
            // Generate team report using team-specific raw data
            const teamReport = tools.getReport(teamRaw);
            console.log(teamReport)
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
      //console.log(rawLeague)
      return
      let leagueReport = tools.getReport(rawLeague);
      const jsonFilePath = path.join(reportFilePath, league + '.json');
      console.log(league + ' report written: ' + league + '.json')
      await fs.writeFile(jsonFilePath, JSON.stringify(leagueReport, null, 2));
    }
     // Calculate world report
     const worldReportData = tools.getReport(worldRaw);

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
