import { redirect } from 'next/navigation';

// Legacy route — the player directory now lives at /users.
export default function AllUsersPage() {
	redirect('/users');
}
