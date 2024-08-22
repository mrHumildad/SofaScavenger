const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const emptyWorld = require('./world')
const dataDir = 'data/';
const reportsDir = 'reports/';
const role2Acts = (roles, pos) => {
	//console.log(roles);
	const r2a =	{
		GK: [ 'gkp', 'gkp', 'gkp', 'gkp', 'gkp', 'gkp' ],
		G: [ 'gkp', 'gkp', 'gkp', 'gkp', 'gkp', 'gkp' ],
		DC: [ 'def', 'def', 'def', 'def', 'def', 'mid' ],
		D: [ 'def', 'def', 'def', 'def', 'def', 'mid' ],
		DR: [ 'def', 'def', 'def', 'def', 'mid', 'mid' ],
		DL: [ 'def', 'def', 'def', 'def', 'mid', 'mid' ],
		DM: [ 'mid', 'mid', 'mid', 'mid', 'def', 'def' ],
		M: [ 'mid', 'mid', 'mid', 'mid', 'def', 'att' ],
		MC: [ 'mid', 'mid', 'mid', 'mid', 'def', 'att' ],
	  MR: [ 'mid', 'mid', 'mid', 'mid', 'def', 'att' ],
		ML: [ 'mid', 'mid', 'mid', 'mid', 'def', 'att' ],
		AM: [ 'mid', 'mid', 'mid', 'att', 'att', 'att' ],
		RW: [ 'att', 'att', 'att', 'att', 'mid', 'mid' ],
		LW: [ 'att', 'att', 'att', 'att', 'mid', 'mid' ],
		F: [ 'att', 'att', 'att', 'att', 'att', 'mid' ],
		ST: [ 'att', 'att', 'att', 'att', 'att', 'mid' ],
	}
	return roles.length
	? r2a[roles[0].role]
	:	r2a[pos];
};
const playerStats = {
	goals: 0,
	shoots: 0,
	dangers: 0,
	poss: 0,
	defs: 0,
	saves: 0,
}
const teamStats = {
	wins: 0,
	loss: 0,
	draw: 0,
	goals: 0,
	goalsRecived: 0,
	points: 0,
	stack: [],
	shoots: 0,
	dangers: 0,
	poss: 0,
	defs: 0,
	saves: 0
}
const calculatePlayerTotals = (player) => {
	let totals =
	{
			tot: 0,
			gkp: 0,
			def: 0,
			mid: 0,
			att: 0,
	}
	for (let i = 0; i < player.die.length; i++) {
		totals[player.die[i].act] += player.die[i].value;
	}
	totals.tot = totals.gkp + totals.def + totals.mid + totals.att;
	return totals;
}
const makePlayer = (data, repo) => {
	//console.log(data.id)
	if (!data.position)
		return ;
	//console.log(data)
	const role = data.attr.roles ? data.attr.roles : [{role: data.position}];
	//const mainRole = role[0].role;
	let positions = [];
	if (data.attr && data.attr.roles) {
		for (let index = 0; index < data.attr.roles.length; index++) {
			const position = data.attr.roles[index];
			positions.push(position.role);
		}
		//console.log(positions);
	}
	let pl = {
		name: data.name,
		id: data.id,
		role: data.position,
		positions: positions,
		nat: data.country,
		shirt: data.jerseyNumber,
		team: data.team,
		age: tools.calculateAge(data.dateOfBirth),
		price: data.marketValue,
		action: null,
		stats: playerStats,
		//matchStats: playerStats,
		market: true,
		die: [
			{face: 0, act: role2Acts(role, data.position)[0], value: 2},
			{face: 1, act: role2Acts(role, data.position)[1], value: 2},
			{face: 2, act: role2Acts(role, data.position)[2], value: 2},
			{face: 3, act: role2Acts(role, data.position)[3], value: 2},
			{face: 4, act: role2Acts(role, data.position)[4], value: 2},
			{face: 5, act: role2Acts(role, data.position)[5], value: 2},
		],

	};
	//console.log(pl.die)
	const Qvalue = data.marketValue
	?	tools.findQ(repo.plValue[data.position].qArr, data.marketValue)
	: 1 ;
	const Qage = tools.findQ(repo.plAge[data.position].qArr, tools.calculateAge(data.dateOfBirth));
	if (!data.attr.ATT) {
		let plTOT = Qvalue * 2 // TO TEST!!!!!!!
		//console.log('making ', data.name, 'role: ', role, plTOT);
		let faceOdds = [7, 7, 7, 5, 5, 4];
		while (plTOT >= 0) {
			//console.log(plTOT, faceOdds)
			const faceIndex = tools.lottery(faceOdds);
			//console.log(faceIndex)
			faceOdds[faceIndex]--;
			pl.die[faceIndex].value++;
			plTOT--;
		};
		pl.totals = calculatePlayerTotals(pl)
		return pl ;
	} else {
		//console.log('making ATTTTR', data.name, 'role: ', data.position);
		//console.log('findQ(ATT) : ' + tools.findQ(repo.ATT[data.position].qArr, data.attr.ATT))
		const QATT = Math.round(tools.findQ(repo.ATT[data.position].qArr, data.attr.ATT)) //+ tools.findQ(repo.ATT.TOT.qArr, data.attr.ATT)) / 4);
		const QTEC = Math.round(tools.findQ(repo.TEC[data.position].qArr, data.attr.TEC)) //+ tools.findQ(repo.TEC.TOT.qArr, data.attr.TEC)) / 4);
		const QTAC = Math.round(tools.findQ(repo.TAC[data.position].qArr, data.attr.TAC)) //+ tools.findQ(repo.TAC.TOT.qArr, data.attr.TAC)) / 4);
		const QDEF = Math.round(tools.findQ(repo.DEF[data.position].qArr, data.attr.DEF)) //+ tools.findQ(repo.DEF.TOT.qArr, data.attr.DEF)) / 4);
		const QCRE = Math.round(tools.findQ(repo.CRE[data.position].qArr, data.attr.CRE)) //+ tools.findQ(repo.CRE.TOT.qArr, data.attr.CRE)) / 4);
		//console.log(QATT, QTEC, QTAC, QDEF, QCRE);
		if (data.position == 'G') {
			let plTOT = QATT + QTEC + QTAC + QDEF + QCRE;

			//console.log('making ', data.name, 'role: ', role, plTOT);
			let faceOdds = [7, 7, 7, 7, 7, 7];
			while (plTOT >= 0) {
				//console.log(plTOT, faceOdds)
				const faceIndex = tools.lottery(faceOdds);
				//console.log(faceIndex)
				faceOdds[faceIndex]--;
				pl.die[faceIndex].value++;
				plTOT--;
			};
			pl.totals = calculatePlayerTotals(pl)
			return pl;
		};
		let facesByRole = {};
		let tots = {};
		let values = {
			def:  Math.round(((QDEF * 6) + (QTEC * 2) + (QTAC * 2)) / 10 /* * facesByRole.def.length */),
			mid:  Math.round(((QCRE * 4) + (QTEC * 4) + (QTAC * 4) + QATT + QDEF) / 14 /* * facesByRole.mid.length */),
			att:  Math.round(((QATT * 6) + (QTEC * 2) + (QTAC * 2) + QCRE) / 12 /* * facesByRole.att.length */)
		}
		for (let index = 0; index < pl.die.length; index++) {
			const face = pl.die[index];
			if (!facesByRole[face.act]) {
				facesByRole[face.act] = [];
				tots[face.act] = values[face.act];
			};
			facesByRole[face.act].push(index)
		};
		//console.log(facesByRole);
		//console.log(tots);
		const acts = Object.keys(facesByRole);
		//console.log(acts);
		for (let index = 0; index < acts.length; index++) {
			const act = acts[index];
			const actIndexArray = facesByRole[act];
			//console.log('doing ', act, index, '/', acts.length, ' points: ', tots[act]);
			let faceOdds = [];
			for (let index = 0; index < actIndexArray.length; index++) {
				faceOdds.push(7);
			};
			let plTOT = tots[act];
			while (plTOT > 0) {
				//console.log(plTOT, faceOdds)
				const oddIndex = tools.lottery(faceOdds);
				faceOdds[oddIndex]--;
				const dieIndex = actIndexArray[oddIndex];
				pl.die[dieIndex].value++;
				plTOT--;
			};
		};
		/* console.log(
			pl.die[0].act, pl.die[0].value,
			pl.die[1].act, pl.die[1].value,
			pl.die[2].act, pl.die[2].value,
			pl.die[3].act, pl.die[3].value,
			pl.die[4].act, pl.die[4].value,
			pl.die[5].act, pl.die[5].value,
		); */
		pl.totals = calculatePlayerTotals(pl)
		return pl;
	};
};

const makeCoach = (data, repo) => {
	const actions = ['fix', 'boost', 'reroll'];
	let coach = {
		name: data.name,
		id:data.id,
		formations: [data.favFormation],
		age: tools.calculateAge(data.birth),
		die: [
			{face: 0, act:'fix', value: 2, used: 0, targets: ['mid']},
			{face: 1, act:'fix', value: 2, used: 0, targets: ['mid']},
			{face: 2, act:'boost', value: 2, used: 0, targets: ['mid']},
			{face: 3, act:'boost', value: 2, used: 0, targets: ['mid']},
			{face: 4, act:'reroll', value: 2, used: 0, targets: ['mid']},
			{face: 5, act:'reroll', value: 2, used: 0, targets: ['mid']},
		]
	};
	if (!data.performance) {
		return coach;
	}
	const pointsXG = ((data.performance.wins * 3) +   data.performance.draws) / data.performance.total
	const goalsXG = data.performance.goalsScored /   data.performance.total
	const concededXG = data.performance.goalsConceded /   data.performance.total
	//console.log([pointsXG, goalsXG, concededXG]);
	const Qtotal = tools.findQ(repo.total.qArr, data.performance.total)
	const QpointsXG = tools.findQ(repo.pointsXGame.qArr, pointsXG)
	const QgoalsXG = tools.findQ(repo.goalsXGame.qArr, goalsXG)
	const QconcededXG = 7 - tools.findQ(repo.concededXGame.qArr, concededXG)
	//console.log(coach.name, ['Qtotal', Qtotal, 'QpointsXG', QpointsXG, 'QgoalsXG', QgoalsXG, 'QconcededXG', QconcededXG]);
	if (QgoalsXG > 3 ) {
		const jump = QgoalsXG > 5	?	1: 2;
		for (let index = 0; index < coach.die.length; index+=jump) {
			const face = coach.die[index];
			face.targets.push('att');
		}
	}
	if (QconcededXG > 3 ) {
		const jump = QconcededXG > 5	?	1 : 2;
		const startI = QconcededXG > 5	?	0 : 1;
		for (let index = startI; index < coach.die.length; index+=jump) {
			const face = coach.die[index];
			face.targets.push('def');
		}
	}
	const maxValue = 6;
	let faceOdds = [4, 4, 4, 4, 4, 4];
	let totalPoints = ((Qtotal + QpointsXG) * 2) + ((QconcededXG + QgoalsXG) / 2) - 12 ;
	
	while (totalPoints >= 0) {
		const faceIndex = tools.lottery(faceOdds);
		faceOdds[faceIndex]--;
		coach.die[faceIndex].value++;
		totalPoints--;
	};
	/* for (let index = 0; index < coach.die.length; index++) {
		const face = coach.die[index];
		console.log(face.act, face.value, face.targets)	
	} */
	return coach ;
};

const teamMaker = async (teamPath, repo) => {
	
	try {
		const data = JSON.parse(await fs.readFile(teamPath, 'utf8'));
		let team  = {
			id: data.id,
			abbr: data.abbr,
			stadium: data.stadium,
			colors : [data.colors.primary, data.colors.secondary],
			formation: data.coach.favFormation,
			roster: []
		};
		team.coach = makeCoach(data.coach, repo.coach);
		let rawRoster = data.roster.sort((a, b) => b.marketValue - a.marketValue)
		let noValuePlayers = data.roster.filter(player => !player.marketValue)
    console.log('Analizing team ', data.name, data.id, data.roster.length, rawRoster.length, noValuePlayers.length);
		let goalies = 0;
		let i = 0;
		//console.log('PLAYER NUMBER:   ', playernumber , ' GOALIES: ' );
		let playernumber = data.roster.length < 24 ? data.roster.length : 24 ;
		while (i < playernumber) {
			if (rawRoster[i].position == 'G') {
				goalies++
			}
			team.roster.push(makePlayer(rawRoster[i], repo))
			i ++;
		};
		i = 0
		if (goalies == 0) {
			console.log('NO GOALIES');
			console.log(data.roster.find(e => e.position == 'G').name)
			team.roster.push(makePlayer(data.roster.find(e => e.position == 'G'), repo))
		}
		//console.log(team);
		return team ;
	} catch (error) {
		console.error('Error reading or parsing the file:', error);
	};
};

const main = async () => {
	let world = {...emptyWorld}
	try {
		console.log('BUILDING WORLD OBJECT')
		const repo = JSON.parse(await fs.readFile('REPORT.json', 'utf8'));
    console.log('opened report and parsed ');
		const nations = Object.keys(world.nations);
		console.log(nations)
		const leaguesDIRS = await fs.readdir(dataDir);
		for (let index = 0; index < nations.length; index++) {
			const nation = nations[index];
			console.log('MAKING NATION: ', 	nation);
			for (let index = 0; index < world.nations[nation].leagues.length; index++) {
				const league = world.nations[nation].leagues[index];
				const leaguePath = path.resolve(dataDir,league.name);
				const teams = await fs.readdir(leaguePath);
				console.log('	found ', teams.length, ' in ', 	league.name);
				let teamObjArr = []
				for (const teamFile of teams) {
					const teamPath = path.resolve(leaguePath, teamFile);
					const team = await teamMaker(teamPath, repo);
					teamObjArr.push(team)
				};
				world.nations[nation].leagues[index] = teamObjArr;
			}
		}
		await fs.writeFile('WORLD.json', JSON.stringify(world, null, 2));
  	console.log('WORLD GENERATED AND WRITTEN');
	} catch (error) {
		console.error('Error reading or parsing the file:', error);
	};
}

main();

