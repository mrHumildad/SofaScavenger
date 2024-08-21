const fs = require('fs/promises');
const path = require('path');
const tools = require('./tools');
const { start } = require('repl');
const dataDir = 'data/';
const reportsDir = 'reports/';
const role2Acts = (roles) => {
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
	return r2a[roles[0].role];
};
const makePlayer = (data, repo) => {
	//console.log(data)
	const role = data.attr.roles ? data.attr.roles : [{role: data.position}];
	const mainRole = role[0].role;
	let pl = {
		name: data.name,
		die: [
			{face: 0, act: role2Acts(role)[0], value: 2},
			{face: 1, act: role2Acts(role)[1], value: 2},
			{face: 2, act: role2Acts(role)[2], value: 2},
			{face: 3, act: role2Acts(role)[3], value: 2},
			{face: 4, act: role2Acts(role)[4], value: 2},
			{face: 5, act: role2Acts(role)[5], value: 2},
		]
	};
	console.log(pl.die)
	const Qvalue = tools.findQ(repo.plValue[data.position].qArr, data.marketValue);
	const Qage = tools.findQ(repo.plAge[data.position].qArr, tools.calculateAge(data.dateOfBirth));
	/* let plTOT = data.attr && data.attr.ATT ?	Number(data.attr.ATT) + Number(data.attr.TEC) + Number(data.attr.TAC) + Number(data.attr.DEF) + Number(data.attr.CRE) :	repo.TOT[data.position].qArr[Qvalue] */
	//console.log('***', Qvalue, tools.calculateAge(data.dateOfBirth), Qage);
	if (!data.attr.ATT) {
		let plTOT = Qvalue * 2 // TO TEST!!!!!!!
		console.log('making ', data.name, 'role: ', role, plTOT);
		let faceOdds = [7, 7, 7, 5, 5, 4];
		while (plTOT >= 0) {
			//console.log(plTOT, faceOdds)
			const faceIndex = tools.lottery(faceOdds);
			//console.log(faceIndex)
			faceOdds[faceIndex]--;
			pl.die[faceIndex].value++;
			plTOT--;
		};
		return pl ;
	} else {
		console.log('making ATTTTR', data.name, 'role: ', data.position);
		//console.log('findQ(ATT) : ' + tools.findQ(repo.ATT[data.position].qArr, data.attr.ATT))
		const QATT = Math.round(tools.findQ(repo.ATT[data.position].qArr, data.attr.ATT)) //+ tools.findQ(repo.ATT.TOT.qArr, data.attr.ATT)) / 4);
		const QTEC = Math.round(tools.findQ(repo.TEC[data.position].qArr, data.attr.TEC)) //+ tools.findQ(repo.TEC.TOT.qArr, data.attr.TEC)) / 4);
		const QTAC = Math.round(tools.findQ(repo.TAC[data.position].qArr, data.attr.TAC)) //+ tools.findQ(repo.TAC.TOT.qArr, data.attr.TAC)) / 4);
		const QDEF = Math.round(tools.findQ(repo.DEF[data.position].qArr, data.attr.DEF)) //+ tools.findQ(repo.DEF.TOT.qArr, data.attr.DEF)) / 4);
		const QCRE = Math.round(tools.findQ(repo.CRE[data.position].qArr, data.attr.CRE)) //+ tools.findQ(repo.CRE.TOT.qArr, data.attr.CRE)) / 4);
		//console.log(QATT, QTEC, QTAC, QDEF, QCRE);
		if (data.position == 'G') {
			let plTOT = QATT + QTEC + QTAC + QDEF + QCRE
			console.log('making ', data.name, 'role: ', role, plTOT);
			let faceOdds = [7, 7, 7, 7, 7, 7];
			while (plTOT >= 0) {
				//console.log(plTOT, faceOdds)
				const faceIndex = tools.lottery(faceOdds);
				//console.log(faceIndex)
				faceOdds[faceIndex]--;
				pl.die[faceIndex].value++;
				plTOT--;
			};
			return pl;
		};
		let facesByRole = {}
		let tots = {}
		if (tools.countFaces(pl.die, 'def')[0]) {
			facesByRole.def = tools.countFaces(pl.die, 'def')
			tots.def = Math.round(((QDEF * 6) + (QTEC * 2) + (QTAC * 2)) / 10 * facesByRole.def.length);
		}
		if (tools.countFaces(pl.die, 'mid')[0]) {
			facesByRole.mid = tools.countFaces(pl.die, 'mid')
			tots.mid =  Math.round(((QCRE * 4) + (QTEC * 4) + (QTAC * 4) + QATT + QDEF) / 14 * facesByRole.mid.length);
		}
		if (tools.countFaces(pl.die, 'att')[0]) {
			facesByRole.att = tools.countFaces(pl.die, 'att')
			tots.att =  Math.round(((QATT * 6) + (QTEC * 2) + (QTAC * 2) + QCRE) / 12 * facesByRole.att.length);
		}
		
		console.log('+++++', facesByRole.def, facesByRole.mid, facesByRole.att)
		
		//console.log(data.name, data.position, facesByRole.def.length, tots.def, facesByRole.mid.length, tots.mid,  facesByRole.att.length, tots.att);
		for (const role in facesByRole) {
			/* if (!facesByRole[role][0]) {
				continue;
			} */
			let arr = facesByRole[role];
			let faceOdds = [];
			for (let index = 0; index < arr.length; index++) {
				faceOdds.push(7);
			};
			let plTOT = tots[role]
			console.log('calculating ', role, arr, plTOT, faceOdds)
			while (plTOT >= 0) {
				//console.log(plTOT, faceOdds)
				const faceIndex = tools.lottery(faceOdds);
				console.log('faceIndex', faceIndex, 'OF ', arr);
				faceOdds[faceIndex]--;
				pl.die[arr[faceIndex]].value++;
				plTOT--;
			};
		};
		console.log(
			pl.die[0].act, pl.die[0].value,
			pl.die[1].act, pl.die[1].value,
			pl.die[2].act, pl.die[2].value,
			pl.die[3].act, pl.die[3].value,
			pl.die[4].act, pl.die[4].value,
			pl.die[5].act, pl.die[5].value,
		);
		return pl;
	};
	console.log('SOMETHING IS WRONG')
	return;
};


const makeCoach = (data, repo) => {
	const actions = ['fix', 'boost', 'reroll'];
	let coach = {
		name: data.name,
		id:data.id,

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
	let team  = {roster: []};
	/* const dataFileName = teamId + '.json';
  const dataPath = path.resolve(dataDir, dataFileName); */
	
	try {
		const data = JSON.parse(await fs.readFile(teamPath, 'utf8'));
    console.log('Analizing team ', data.name, data.id);
		team.coach = makeCoach(data.coach, repo.coach);
		let rawRoster = data.roster.sort((a, b) => b.marketValue - a.marketValue)
		let playernumber = data.roster.length < 24 ? data.roster.length : 24 ;
		if (playernumber != 24)
			console.log('PLAYER NUMBER:   ', playernumber);
		let i = 0;
		while (i < playernumber) {
			//console.log('create player: ', rawRoster[i].name)
			//console.log('create player: ', rawRoster[i].attr.roles)
			/* if (rawRoster[i].attr && rawRoster[i].attr.roles )
				console.log(rawRoster[i].attr.roles) */
			team.roster.push(makePlayer(rawRoster[i], repo))
			i ++;
		};
		return team ;
	} catch (error) {
		console.error('Error reading or parsing the file:', error);
	};
};

const main = async () => {
  try {
		const repo = JSON.parse(await fs.readFile('REPORT.json', 'utf8'));
    console.log('opened report and parsed ');
		const leagues = await fs.readdir(dataDir);
		console.log('leagues: ' , leagues)
		for (const league of leagues) {
			console.log('ACCESSING LEAGUE: ' + league);
			const leaguePath = path.resolve(dataDir,league);
			const teams = await fs.readdir(leaguePath);
			//console.log(teams);
			for (const teamFile of teams) {
				const teamPath = path.resolve(leaguePath, teamFile);
				const team = await teamMaker(teamPath, repo);
			}
		}
	} catch (error) {
		console.error('Error reading or parsing the file:', error);
	};
}

main();

