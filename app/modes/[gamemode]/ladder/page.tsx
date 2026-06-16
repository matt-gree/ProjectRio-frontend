'use client';

import { use } from 'react';
import Link from 'next/link';
import LadderTable from '@/components/LadderTable';
import { PageHeader, Panel } from '@/components/ui';

export default function LadderPage({ params }: { params: Promise<{ gamemode: string }> }) {
	const modeName = decodeURIComponent(use(params).gamemode);

	return (
		<div className="space-y-6">
			<PageHeader kicker="Ranked ladder" title={modeName}>
				<Link href={`/modes/${encodeURIComponent(modeName)}/peak`} className="btn-secondary text-sm">
					ELO Peaks
				</Link>
				<Link href={`/modes/${encodeURIComponent(modeName)}`} className="btn-secondary text-sm">
					Mode Hub
				</Link>
			</PageHeader>
			<Panel>
				<LadderTable gameMode={modeName} />
			</Panel>
		</div>
	);
}
