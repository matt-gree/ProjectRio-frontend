'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getCharPitchingStats, DEFAULT_MODE } from '@/lib/api';
import { characterIdFromName } from '@/lib/data/characters';
import { getERA } from '@/lib/statCalcs';
import { PitchingStatsTable, ModeSelect, type StatRow } from '@/components/StatsTables';
import { PageHeader, Panel, Spinner, ErrorState } from '@/components/ui';

export default function CharPitchingPage({ params }: { params: Promise<{ char: string }> }) {
	const char = decodeURIComponent(use(params).char);
	const [mode, setMode] = useState(DEFAULT_MODE);
	const [data, setData] = useState<{ overall: any; byUser: any } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setData(null);
		getCharPitchingStats(char === 'all' ? null : characterIdFromName(char), mode)
			.then((result) => {
				if (!cancelled) setData(result);
			})
			.catch(() => {
				if (!cancelled) setError('Could not load pitching stats.');
			});
		return () => {
			cancelled = true;
		};
	}, [char, mode]);

	const rows: StatRow[] = [];
	const overall = data?.overall?.Pitching;
	if (overall) {
		rows.push({ title: 'ALL', stats: overall, highlight: true });
	}
	if (data?.byUser) {
		// Only show players with at least 1% of total outs pitched, best ERA first.
		const users = Object.keys(data.byUser)
			.filter((user) => data.byUser[user]?.Pitching?.outs_pitched > (overall?.outs_pitched ?? 0) / 100)
			.sort(
				(a, b) =>
					parseFloat(String(getERA(data.byUser[a]?.Pitching))) -
					parseFloat(String(getERA(data.byUser[b]?.Pitching)))
			);
		for (const user of users) {
			rows.push({
				title: user,
				href: `/users/${encodeURIComponent(user)}/pitching`,
				stats: data.byUser[user]?.Pitching
			});
		}
	}

	return (
		<div className="space-y-6">
			<PageHeader kicker="Character pitching" title={char}>
				<ModeSelect value={mode} onChange={setMode} />
				<Link href={`/characters/${encodeURIComponent(char)}/batting`} className="btn-secondary text-sm">
					Batting
				</Link>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{!data && !error && <Spinner label="Loading pitching stats…" />}
			{data && (
				<Panel>
					<PitchingStatsTable label="Player" rows={rows} />
				</Panel>
			)}
		</div>
	);
}
