import { redirect } from 'next/navigation';

// Legacy route — tags now live at /tags.
export default function TagListPage() {
	redirect('/tags');
}
