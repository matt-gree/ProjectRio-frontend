'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserPitchingStats, DEFAULT_MODE } from '@/lib/api';
import { PitchingStatsTable, ModeSelect, type StatRow } from '@/components/StatsTables';
import { PageHeader, Panel, Spinner, ErrorState } from '@/components/ui';

export default function UserPitchingPage({ params }: { params: Promise<{ user: string }> }) {
	const user = decodeURIComponent(use(params).user);
	const [mode, setMode] = useState(DEFAULT_MODE);
	const [data, setData] = useState<{ overall: any; byChar: any } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setData(null);
		getUserPitchingStats(user, mode)
			.then((result) => {
				if (!cancelled) setData(result);
			})
			.catch(() => {
				if (!cancelled) setError('Could not load pitching stats.');
			});
		return () => {
			cancelled = true;
		};
	}, [user, mode]);

	const rows: StatRow[] = [];
	if (data?.overall?.Pitching) {
		rows.push({ title: 'ALL', stats: data.overall.Pitching, highlight: true });
	}
	if (data?.byChar) {
		const chars = Object.keys(data.byChar)
			.filter((char) => data.byChar[char]?.Pitching?.outs_pitched > 0)
			.sort((a, b) => data.byChar[b]?.Pitching?.outs_pitched - data.byChar[a]?.Pitching?.outs_pitched);
		for (const char of chars) {
			rows.push({
				title: char,
				href: `/characters/${encodeURIComponent(char)}/pitching`,
				stats: data.byChar[char]?.Pitching
			});
		}
	}

	return (
		<div className="space-y-6">
			<PageHeader kicker="Pitching" title={user}>
				<ModeSelect value={mode} onChange={setMode} />
				<Link href={`/users/${encodeURIComponent(user)}/batting`} className="btn-secondary text-sm">
					Batting
				</Link>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{!data && !error && <Spinner label="Loading pitching stats…" />}
			{data && (
				<Panel>
					<PitchingStatsTable label="Character" rows={rows} />
				</Panel>
			)}
		</div>
	);
}
