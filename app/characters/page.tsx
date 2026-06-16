import Link from 'next/link';
import { characters, characterClasses, characterImage } from '@/lib/data/characters';
import { PageHeader, Badge } from '@/components/ui';

export const metadata = { title: 'Characters' };

const CLASS_COLORS: { [key: string]: 'red' | 'gold' | 'gray' | 'green' } = {
	Power: 'red',
	Technique: 'gold',
	Speed: 'green',
	Balance: 'gray'
};

export default function CharactersPage() {
	return (
		<div>
			<PageHeader kicker="Roster" title="Characters" />
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{Object.values(characters).map((char) => {
					const charClass = characterClasses[char]?.Class;
					return (
						<Link
							key={char}
							href={`/characters/${encodeURIComponent(char)}`}
							className="panel panel-glow flex flex-col items-center gap-2 p-4 text-center"
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={characterImage(char)} alt="" className="h-16 w-16 object-contain" />
							<span className="font-display font-semibold">{char}</span>
							{charClass && <Badge color={CLASS_COLORS[charClass]}>{charClass}</Badge>}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
