// Batting
export const getPa = (stats: any): number =>
	stats?.summary_at_bats + stats?.summary_walks_hbp + stats?.summary_walks_bb + stats?.summary_sac_flys;

export const getAvg = (stats: any): number =>
	stats?.summary_at_bats === 0 ? 0 : stats?.summary_hits / stats?.summary_at_bats;

export const getObp = (stats: any): number =>
	getPa(stats) === 0
		? 0
		: (stats?.summary_hits + stats?.summary_walks_hbp + stats?.summary_walks_bb) / getPa(stats);

export const getSlg = (stats: any): number =>
	stats?.summary_at_bats === 0
		? 0
		: (stats?.summary_singles +
				stats?.summary_doubles * 2 +
				stats?.summary_triples * 3 +
				stats?.summary_homeruns * 4) /
			stats?.summary_at_bats;

export const getOps = (stats: any): number => getObp(stats) + getSlg(stats);

// Pitching
export const getIpString = (stats: any): string =>
	Math.floor(stats?.outs_pitched / 3) + '.' + (stats?.outs_pitched % 3);

export const getOppAvg = (stats: any): string =>
	(stats?.hits_allowed / (stats?.batters_faced - stats?.walks_bb - stats?.walks_hbp)).toFixed(3);

export const getKPct = (stats: any): string =>
	((stats?.strikeouts_pitched / stats?.batters_faced) * 100).toFixed(1);

export const getERA = (stats: any): string | number =>
	stats?.outs_pitched === 0
		? stats?.runs_allowed === 0
			? '0.00'
			: '99.99'
		: (stats?.runs_allowed / (stats?.outs_pitched / 27)).toFixed(2);

// Display formatting: ".312" style for rate stats
export const fmtRate = (value: number): string => {
	if (!isFinite(value)) return '-';
	const fixed = value.toFixed(3);
	return value < 1 ? fixed.replace(/^0/, '') : fixed;
};
