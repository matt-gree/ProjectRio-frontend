'use client';

import { useSyncExternalStore } from 'react';

// Username is persisted to localStorage on login and broadcast via a custom
// event so every subscribed component updates within the same tab.
const USERNAME_KEY = 'username';
const USERNAME_EVENT = 'rio:username';

function subscribe(callback: () => void) {
	window.addEventListener(USERNAME_EVENT, callback);
	window.addEventListener('storage', callback);
	return () => {
		window.removeEventListener(USERNAME_EVENT, callback);
		window.removeEventListener('storage', callback);
	};
}

export function useUsername(): string | null {
	return useSyncExternalStore(
		subscribe,
		() => localStorage.getItem(USERNAME_KEY),
		() => null
	);
}

export function setStoredUsername(username: string | null) {
	if (username) {
		localStorage.setItem(USERNAME_KEY, username);
	} else {
		localStorage.removeItem(USERNAME_KEY);
	}
	window.dispatchEvent(new Event(USERNAME_EVENT));
}
