'use client';

import { useState, type FormEvent } from 'react';
import { BACKEND, COMMUNITY_ENDPOINTS } from '@/lib/api';
import { PageHeader } from '@/components/ui';

export default function CreateCommunityPage() {
	const [name, setName] = useState('');
	const [type, setType] = useState<'Official' | 'Unofficial'>('Unofficial');
	const [isPrivate, setIsPrivate] = useState(false);
	const [globalLink, setGlobalLink] = useState(false);
	const [desc, setDesc] = useState('');
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setStatus('submitting');
		try {
			const response = await fetch(BACKEND + COMMUNITY_ENDPOINTS.COMMUNITY_CREATE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					community_name: name,
					type,
					private: isPrivate,
					global_link: globalLink,
					desc
				})
			});
			setStatus(response.ok ? 'success' : 'error');
		} catch {
			setStatus('error');
		}
	}

	if (status === 'success') {
		return (
			<div className="mx-auto max-w-lg">
				<div className="panel p-8 text-center">
					<h1 className="text-3xl uppercase">Community Created</h1>
					<p className="mt-3 text-sm text-fog-300">“{name}” is ready. Invite your players from the Discord.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-lg">
			<PageHeader kicker="Community" title="Create a Community" />
			<form onSubmit={handleSubmit} className="panel space-y-5 p-6">
				<div>
					<label className="label" htmlFor="name">
						Community Name
					</label>
					<input
						id="name"
						className="input"
						required
						maxLength={100}
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</div>
				<div>
					<label className="label" htmlFor="type">
						Type
					</label>
					<select id="type" className="input" value={type} onChange={(event) => setType(event.target.value as any)}>
						<option value="Unofficial">Unofficial</option>
						<option value="Official">Official</option>
					</select>
				</div>
				<div className="flex gap-6">
					<label className="flex items-center gap-2 text-sm text-fog-300">
						<input
							type="checkbox"
							className="accent-rio-500"
							checked={isPrivate}
							onChange={(event) => setIsPrivate(event.target.checked)}
						/>
						Private
					</label>
					<label className="flex items-center gap-2 text-sm text-fog-300">
						<input
							type="checkbox"
							className="accent-rio-500"
							checked={globalLink}
							onChange={(event) => setGlobalLink(event.target.checked)}
						/>
						Global invite link
					</label>
				</div>
				<div>
					<label className="label" htmlFor="desc">
						Description
					</label>
					<textarea
						id="desc"
						className="input min-h-28"
						required
						maxLength={1000}
						value={desc}
						onChange={(event) => setDesc(event.target.value)}
					/>
				</div>
				{status === 'error' && (
					<p className="text-sm text-rio-300">
						Could not create the community. Make sure you are logged in and the name is not taken.
					</p>
				)}
				<button type="submit" className="btn-primary w-full" disabled={status === 'submitting'}>
					{status === 'submitting' ? 'Creating…' : 'Create Community'}
				</button>
			</form>
		</div>
	);
}
