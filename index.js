const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const leaguesDir = 'data/';
const reportsDir = 'reports/';
const _ = require('lodash');

async function processLeagues() {
  
  let worldRaw = _.cloneDeep(tools.rawInit);
  let rolesArr = [];
  let abilities = [];
  let tactics = [];
  try {
    const leagues = await fs.readdir(leaguesDir);
    console.log('Leagues found:', leagues.length);
    for (const league of leagues) {
      const leagueDir = path.join(leaguesDir, league);
      console.log('League analize => ', leagueDir);
      //let rawLeague = {...tools.rawInit};

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
            let teamRaw = _.cloneDeep(tools.rawInit);
            const coach = teamData.coach;
            worldRaw.coachAge.push(tools.calculateAge(coach.birth));
            /* for (const stat of coach.performance) {
              worldRaw.coach[stat].push(coach.performance[stat])
            } */
            worldRaw.coach.pointsXGame.push(((coach.performance.wins * 3) +   coach.performance.draws) / coach.performance.total)
            worldRaw.coach.goalsXGame.push(coach.performance.goalsScored /   coach.performance.total)
            worldRaw.coach.concededXGame.push(coach.performance.goalsConceded / coach.performance.total)
            worldRaw.coach.total.push(coach.performance.total)
            if (!tactics.includes(coach.favFormation))
              tactics.push(coach.favFormation);



            for (let index = 0; index < teamData.roster.length; index++) {
              const player = teamData.roster[index];
              if (!player.position) {
                worldRaw.plcounts.noRole++;
                teamRaw.plcounts.noRole++;
                continue ;
              };
              worldRaw.plcounts.total[player.position]++
              teamRaw.plcounts.total[player.position]++
              if (!player.marketValue) {
                worldRaw.plcounts.noPrice[player.position]++
                teamRaw.plcounts.noPrice[player.position]++
              }
              if (player.attr.ATT && player.attr.rating && player.marketValue) {
                worldRaw.plcounts.complete[player.position]++
                teamRaw.plcounts.complete[player.position]++
                const playerTotal = (Number(player.attr.ATT) + Number(player.attr.TEC) + Number(player.attr.TAC) + Number(player.attr.DEF) + Number(player.attr.CRE));
                worldRaw.TOT[player.position].push(playerTotal);
                worldRaw.ATT[player.position].push(Number(player.attr.ATT));
                worldRaw.TEC[player.position].push(Number(player.attr.TEC));
                worldRaw.TAC[player.position].push(Number(player.attr.TAC));
                worldRaw.DEF[player.position].push(Number(player.attr.DEF));
                worldRaw.CRE[player.position].push(Number(player.attr.CRE));
                worldRaw.rating[player.position].push(Number(player.attr.rating));
                worldRaw.TOT.TOT.push(playerTotal);
                worldRaw.ATT.TOT.push(Number(player.attr.ATT));
                worldRaw.TEC.TOT.push(Number(player.attr.TEC));
                worldRaw.TAC.TOT.push(Number(player.attr.TAC));
                worldRaw.DEF.TOT.push(Number(player.attr.DEF));
                worldRaw.CRE.TOT.push(Number(player.attr.CRE));
                worldRaw.rating.TOT.push(Number(player.attr.rating));
                for (let i = 0; i < player.attr.roles.length; i++) {
                  const role = player.attr.roles[i];
                  if (!rolesArr.includes(role.role))
                    rolesArr.push(role.role);
                };
                const strengths = player.attr.strengths[0];
                if (strengths && strengths != 'No outstanding Strengths') {
                  const strArr = strengths.split(/(?=[A-Z])/);
                  /* console.log(strengths);
                  console.log(strArr); */
                  for (let i = 0; i < strArr.length; i++) {
                    const ability = strArr[i].trim();
                    if (!abilities.includes(ability))
                      abilities.push(ability);
                  }
                }
              } else {
                worldRaw.plcounts.noATTR[player.position]++
                teamRaw.plcounts.noATTR[player.position]++
              }
              worldRaw.plAge[player.position].push(tools.calculateAge(player.dateOfBirth));
              worldRaw.plValue[player.position].push(player.marketValue);
            }
            //console.log(teamData.name);  
            //console.log(teamRaw.plcounts); 
            worldRaw.plcounts.byTeam[teamData.abbr + teamData.id] = {...teamRaw.plcounts};
          } catch (error) {
            console.error(`Error parsing team file ${teamFile}:`, error);
          }
        }

      } catch (error) {
        console.error(`Error reading teams for league ${league}:`, error);
      }

      // Generate and write league report
      //console.log(rawLeague)
      
    }

  } catch (error) {
    console.error('Error processing leagues:', error);
  }
  console.log(worldRaw)

  const report = tools.getReport(worldRaw);
  //Geneerate and write worldReport
  console.log('WORLD REPORT:');
  //console.log(report);
  await fs.writeFile('REPORT.json', JSON.stringify(report, null, 2));
  console.log('WORLD REPORT GENERATED AND WRITTEN');
  console.log(rolesArr);
  console.log(abilities);
  console.log(tactics);
};

processLeagues();
