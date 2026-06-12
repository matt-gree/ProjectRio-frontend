export function msToTime(ms: number): string {
	const seconds = ms / 1000;
	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = hours / 24;
	if (seconds < 60) return seconds.toFixed(1) + ' Sec';
	if (minutes < 60) return minutes.toFixed(1) + ' Min';
	if (hours < 24) return hours.toFixed(1) + ' Hrs';
	return days.toFixed(1) + ' Days';
}

// Takes unix time in seconds and returns how long ago it occurred (e.g. "3 Hrs Ago")
export function getTimeSince(time: number): string {
	const s = Math.floor(Date.now() / 1000) - time;
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	const d = Math.floor(h / 24);

	if (h < 1) return m + ' Mins Ago';
	if (h === 1) return h + ' Hr Ago';
	if (d < 1) return h + ' Hrs Ago';
	if (d === 1) return d + ' Day Ago';
	return d + ' Days Ago';
}

export function winLossRecord(
	gameList: { away_user: string; home_user: string; away_score: number; home_score: number }[],
	username: string
): [number, number] {
	let wins = 0;
	let losses = 0;
	for (const game of gameList) {
		if (game.away_user === username) {
			game.away_score > game.home_score ? wins++ : losses++;
		} else if (game.home_user === username) {
			game.home_score > game.away_score ? wins++ : losses++;
		}
	}
	return [wins, losses];
}
