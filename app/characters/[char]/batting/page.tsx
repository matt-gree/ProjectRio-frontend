'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getCharBattingStats, DEFAULT_MODE } from '@/lib/api';
import { characterIdFromName } from '@/lib/data/characters';
import { getPa, getOps } from '@/lib/statCalcs';
import { BattingStatsTable, ModeSelect, type StatRow } from '@/components/StatsTables';
import { PageHeader, Panel, Spinner, ErrorState } from '@/components/ui';

export default function CharBattingPage({ params }: { params: Promise<{ char: string }> }) {
	const char = decodeURIComponent(use(params).char);
	const [mode, setMode] = useState(DEFAULT_MODE);
	const [data, setData] = useState<{ overall: any; byUser: any } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setData(null);
		getCharBattingStats(char === 'all' ? null : characterIdFromName(char), mode)
			.then((result) => {
				if (!cancelled) setData(result);
			})
			.catch(() => {
				if (!cancelled) setError('Could not load batting stats.');
			});
		return () => {
			cancelled = true;
		};
	}, [char, mode]);

	const rows: StatRow[] = [];
	const overall = data?.overall?.Batting;
	if (overall) {
		rows.push({ title: 'ALL', stats: overall, highlight: true });
	}
	if (data?.byUser) {
		// Only show players with at least 1% of total plate appearances, best OPS first.
		const users = Object.keys(data.byUser)
			.filter((user) => getPa(data.byUser[user]?.Batting) > getPa(overall) / 100)
			.sort((a, b) => getOps(data.byUser[b]?.Batting) - getOps(data.byUser[a]?.Batting));
		for (const user of users) {
			rows.push({
				title: user,
				href: `/users/${encodeURIComponent(user)}/batting`,
				stats: data.byUser[user]?.Batting
			});
		}
	}

	return (
		<div className="space-y-6">
			<PageHeader kicker="Character batting" title={char}>
				<ModeSelect value={mode} onChange={setMode} />
				<Link href={`/characters/${encodeURIComponent(char)}/pitching`} className="btn-secondary text-sm">
					Pitching
				</Link>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{!data && !error && <Spinner label="Loading batting stats…" />}
			{data && (
				<Panel>
					<BattingStatsTable label="Player" rows={rows} />
				</Panel>
			)}
		</div>
	);
}
