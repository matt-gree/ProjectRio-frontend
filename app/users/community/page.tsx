'use client';

import { useState, type FormEvent } from 'react';
import { getUserCommunities } from '@/lib/api';
import { PageHeader, Panel, ErrorState } from '@/components/ui';

export default function UserCommunitiesPage() {
	const [user, setUser] = useState('');
	const [lookedUp, setLookedUp] = useState<string | null>(null);
	const [communities, setCommunities] = useState<any[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError(null);
		try {
			const result = await getUserCommunities(user);
			setCommunities(result);
			setLookedUp(user);
		} catch {
			setError('Could not look up communities for that user.');
		}
	}

	return (
		<div>
			<PageHeader kicker="Lookup" title="Communities by Player" />
			<form onSubmit={handleSubmit} className="mb-8 flex max-w-md gap-3">
				<input
					className="input"
					placeholder="Enter username…"
					required
					value={user}
					onChange={(event) => setUser(event.target.value)}
				/>
				<button type="submit" className="btn-primary">
					Search
				</button>
			</form>

			{error && <ErrorState message={error} />}
			{communities && (
				<Panel>
					{communities.length === 0 ? (
						<p className="px-4 py-8 text-center text-sm text-fog-500">
							{lookedUp} is not a member of any communities.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="stat-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Type</th>
										<th>Created</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{communities.map((community) => (
										<tr key={community.name}>
											<td className="font-semibold text-fog-100">{community.name}</td>
											<td>{community.type ?? community.comm_type ?? '—'}</td>
											<td>
												{community.date_created
													? new Date(community.date_created * 1000).toLocaleDateString()
													: '—'}
											</td>
											<td className="max-w-md whitespace-normal text-fog-500">{community.desc ?? ''}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Panel>
			)}
		</div>
	);
}
