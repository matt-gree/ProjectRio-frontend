// Credit to MattGree who made the original version of this code in Python.
import { characterClasses, type CharacterClass } from './characters';

interface TeamNameEntry {
	Name: string;
	Characters?: string[];
}

const inGameTeamNames: { [captain: string]: TeamNameEntry[] } = {
	Mario: [
		{ Name: 'Mario Heroes' },
		{ Name: 'Mario Fireballs' },
		{ Name: 'Mario Sunshines', Characters: ['Luigi', 'Monty', 'Pianta', 'Noki'] },
		{ Name: 'Mario All Stars', Characters: ['Peach', 'Yoshi', 'Donkey Kong', 'Bowser'] }
	],
	Luigi: [
		{ Name: 'Luigi Gentlemen' },
		{ Name: 'Luigi Vacuums' },
		{ Name: 'Luigi Mansioneers', Characters: ['Bowser', 'Toad', 'Boo', 'King Boo'] },
		{ Name: 'Luigi Leapers', Characters: ['Waluigi', 'Diddy', 'Daisy', 'Baby Luigi'] }
	],
	Peach: [
		{ Name: 'Peach Roses' },
		{ Name: 'Peach Dynasties' },
		{ Name: 'Peach Monarchs', Characters: ['Daisy', 'Toad', 'Toadsworth', 'Toadette'] },
		{ Name: 'Peach Princesses', Characters: ['Mario', 'Bowser', 'Baby Mario', 'Bowser Jr'] }
	],
	Daisy: [
		{ Name: 'Daisy Lillies' },
		{ Name: 'Daisy Cupids' },
		{ Name: 'Daisy Queen Bees', Characters: ['Peach', 'Dixie Kong', 'Toadette', 'Noki'] },
		{ Name: 'Daisy Petals', Characters: ['Birdo', 'Dixie Kong', 'Wario', 'Petey'] }
	],
	Yoshi: [
		{ Name: 'Yoshi Eggs' },
		{ Name: 'Yoshi Speed Stars' },
		{ Name: 'Yoshi Islanders', Characters: ['Birdo', 'Baby Mario', 'Baby Luigi', 'Shy Guy'] },
		{ Name: 'Yoshi Flutters', Characters: ['Boo', 'King Boo', 'Paratroopa', 'Paragoomba'] }
	],
	Birdo: [
		{ Name: 'Birdo Beauties' },
		{ Name: 'Birdo Models' },
		{ Name: 'Birdo Bows', Characters: ['Mario', 'Luigi', 'Peach', 'Toad'] },
		{ Name: 'Birdo Fans', Characters: ['Yoshi', 'Shy Guy', 'Goomba', 'Koopa'] }
	],
	Wario: [
		{ Name: 'Wario Garlics' },
		{ Name: 'Wario Steakheads' },
		{ Name: 'Wario Greats', Characters: ['Waluigi', 'King Boo', 'Magikoopa', 'Petey'] },
		{ Name: 'Wario Beasts', Characters: ['DK', 'Bowser', 'Bowser Jr', 'Bro'] }
	],
	Waluigi: [
		{ Name: 'Waluigi Mystiques' },
		{ Name: 'Waluigi Smart Alecks' },
		{ Name: 'Waluigi Flankers', Characters: ['King Boo', 'Wario', 'Magikoopa', 'Dry Bones'] },
		{ Name: 'Waluigi Mashers', Characters: ['Mario', 'Luigi', 'Toadsworth', 'Wario'] }
	],
	DK: [
		{ Name: 'DK Explorers' },
		{ Name: 'DK Wild Ones' },
		{ Name: 'DK Kongs', Characters: ['Diddy', 'Dixie', 'Goomba', 'Koopa'] },
		{ Name: 'DK Animals', Characters: ['Yoshi', 'Bowser', 'Monty', 'Petey'] }
	],
	Diddy: [
		{ Name: 'Diddy Survivors' },
		{ Name: 'Diddy Ninjas' },
		{ Name: 'Diddy Tails', Characters: ['Yoshi', 'Birdo', 'Dixie', 'Boo'] },
		{ Name: 'Diddy Red Caps', Characters: ['Mario', 'Birdo', 'Baby Mario', 'Toadette'] }
	],
	Bowser: [
		{ Name: 'Bowser Flames' },
		{ Name: 'Bowser Blue Shells' },
		{ Name: 'Bowser Monsters', Characters: ['Bowser Jr', 'Bry Bones', 'Bro'] },
		{ Name: 'Bowser Black Stars', Characters: ['Waluigi', 'Wario', 'Petey', 'Bro'] }
	],
	'Bowser Jr': [
		{ Name: 'Jr Fangs' },
		{ Name: 'Jr Bombers' },
		{ Name: 'Jr Pixies', Characters: ['Diddy', 'Boo', 'Shy Guy', 'Goomba'] },
		{ Name: 'Jr Rookies', Characters: ['Diddy', 'Dixie', 'Baby Mario', 'Baby Luigi'] }
	]
};

export function teamName(roster: string[], captain: string): string | undefined {
	if (roster.length === 0 || !inGameTeamNames[captain]) return undefined;

	const simplifiedRoster = roster.map((c) => characterClasses[c]?.SimplifiedName ?? c);

	for (const themed of [inGameTeamNames[captain][2], inGameTeamNames[captain][3]]) {
		const matches = (themed.Characters ?? []).reduce(
			(total, character) => total + simplifiedRoster.filter((r) => r === character).length,
			0
		);
		if (matches >= 4) return themed.Name;
	}

	const classCounts: Record<CharacterClass, number> = { Balance: 0, Technique: 0, Power: 0, Speed: 0 };
	for (const c of roster) {
		const cls = characterClasses[c]?.Class;
		if (cls) classCounts[cls] += 1;
	}

	const captainClass = characterClasses[captain]?.Class;
	if (captainClass) {
		const otherClasses = (Object.keys(classCounts) as CharacterClass[]).filter((c) => c !== captainClass);
		if (otherClasses.every((c) => classCounts[captainClass] > classCounts[c])) {
			return inGameTeamNames[captain][1].Name;
		}
	}

	return inGameTeamNames[captain][0].Name;
}

export function teamImage(name: string): string {
	return `/images/Teams/${name}.png`;
}
