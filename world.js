const world = {
	myTeam: {},
  year: 2025,
  week: 1,
  nations: {
    ITA: {
      nation_id: 1,
			abbr: 'ITA',
			name: 'Italy',
      flag: '',
      leagues: [
        {
					level: 1,
					name: 'Serie_A',
					relegated: 3,
					subs: [5, 3],
					championsLPlaces: 4,
					teams: []
        },
				{
					level: 2,
					name: 'Serie_B',
					relegated: 4,
					subs: [5, 3],
					promoted: 4,
					teams: []
				}
			]
		},
		ESP: {
			nation_id: 2,
			flag: '',
			abbr: 'ESP',
			name: 'España',
      flag: '',
			leagues: [
				{
					level: 1,
					name: 'La_Liga',
					relegated: 3,
					subs: [5, 3],
					championsLPlaces: 4,
					teams: []
				},
				{
					level: 2,
					name: 'Segunda',
					relegated: 4,
					subs: [5, 3],
					promoted: 4,
					teams: []
				}
			]
		},
		ENG: {
			nation_id: 3,
			flag: '',
			abbr: 'ENG',
			name: 'England',
      flag: '',
			leagues: [
				{
					level: 1,
					name: 'Premier_League',
					relegated: 3,
					subs: [5, 3],
					championsLPlaces: 4,
					teams: []
				},
				{
					level: 2,
					name: 'Championship',
					relegated: 4,
					subs: [5, 3],
					promoted: 4,
					teams: []
				}
			]
		},
		ARG: {
			nation_id: 2,
			flag: '',
			abbr: 'ARG',
			name: 'Argentina',
      flag: '',
			leagues: [
				{
					level: 1,
					name: 'LPF',
					relegated: 3,
					subs: [5, 3],
					championsLPlaces: 4,
					teams: []
				}
			]
		}
		}
	}

module.exports = world;

