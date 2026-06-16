'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserBattingStats, DEFAULT_MODE } from '@/lib/api';
import { getPa } from '@/lib/statCalcs';
import { BattingStatsTable, ModeSelect, type StatRow } from '@/components/StatsTables';
import { PageHeader, Panel, Spinner, ErrorState } from '@/components/ui';

export default function UserBattingPage({ params }: { params: Promise<{ user: string }> }) {
	const user = decodeURIComponent(use(params).user);
	const [mode, setMode] = useState(DEFAULT_MODE);
	const [data, setData] = useState<{ overall: any; byChar: any } | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setData(null);
		getUserBattingStats(user, mode)
			.then((result) => {
				if (!cancelled) setData(result);
			})
			.catch(() => {
				if (!cancelled) setError('Could not load batting stats.');
			});
		return () => {
			cancelled = true;
		};
	}, [user, mode]);

	const rows: StatRow[] = [];
	if (data?.overall?.Batting) {
		rows.push({ title: 'ALL', stats: data.overall.Batting, highlight: true });
	}
	if (data?.byChar) {
		const chars = Object.keys(data.byChar).sort(
			(a, b) => getPa(data.byChar[b]?.Batting) - getPa(data.byChar[a]?.Batting)
		);
		for (const char of chars) {
			rows.push({
				title: char,
				href: `/characters/${encodeURIComponent(char)}/batting`,
				stats: data.byChar[char]?.Batting
			});
		}
	}

	return (
		<div className="space-y-6">
			<PageHeader kicker="Batting" title={user}>
				<ModeSelect value={mode} onChange={setMode} />
				<Link href={`/users/${encodeURIComponent(user)}/pitching`} className="btn-secondary text-sm">
					Pitching
				</Link>
			</PageHeader>

			{error && <ErrorState message={error} />}
			{!data && !error && <Spinner label="Loading batting stats…" />}
			{data && (
				<Panel>
					<BattingStatsTable label="Character" rows={rows} />
				</Panel>
			)}
		</div>
	);
}
