import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
	return (
		<footer className="mt-16 border-t border-night-700 bg-night-900">
			<div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
				<div>
					<div className="flex items-center gap-2">
						<Image src="/images/RioLogo.png" alt="" width={28} height={28} className="[image-rendering:pixelated]" />
						<span className="font-display font-bold uppercase tracking-widest">
							Project<span className="text-rio-500">Rio</span>
						</span>
					</div>
					<p className="mt-3 text-sm text-fog-500">
						Competitive Mario Superstar Baseball — online ranked play, stats, and community events.
					</p>
				</div>
				<div>
					<h3 className="kicker">Compete</h3>
					<ul className="mt-3 space-y-2 text-sm text-fog-300">
						<li><Link href="/modes" className="hover:text-fog-100">Ranked Ladders</Link></li>
						<li><Link href="/games/live" className="hover:text-fog-100">Live Games</Link></li>
						<li><Link href="/games/recent" className="hover:text-fog-100">Recent Games</Link></li>
					</ul>
				</div>
				<div>
					<h3 className="kicker">Stats</h3>
					<ul className="mt-3 space-y-2 text-sm text-fog-300">
						<li><Link href="/users" className="hover:text-fog-100">Player Stats</Link></li>
						<li><Link href="/characters" className="hover:text-fog-100">Character Stats</Link></li>
						<li><Link href="/tools/pitch-calculator" className="hover:text-fog-100">Pitch Visualizer</Link></li>
					</ul>
				</div>
				<div>
					<h3 className="kicker">Community</h3>
					<ul className="mt-3 space-y-2 text-sm text-fog-300">
						<li><a href="https://discord.gg/c3r9PabfRU" target="_blank" rel="noreferrer" className="hover:text-fog-100">Discord</a></li>
						<li><a href="https://www.patreon.com/projectrio/posts" target="_blank" rel="noreferrer" className="hover:text-fog-100">Patreon</a></li>
						<li><a href="https://github.com/ProjectRio?tab=repositories" target="_blank" rel="noreferrer" className="hover:text-fog-100">GitHub</a></li>
					</ul>
				</div>
			</div>
			<div className="border-t border-night-800 py-4 text-center text-xs text-fog-500">
				Project Rio is a fan project and is not affiliated with Nintendo.
			</div>
		</footer>
	);
}
