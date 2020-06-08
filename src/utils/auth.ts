import { getDefaultAuthDetails, localStorageAuthDetailsKey, AuthDetails } from "../models/AuthDetails";

export function bearerify(rawToken: string) {
	return `Bearer ${rawToken}`;
}

export function getAuthDetails(key = localStorageAuthDetailsKey): AuthDetails {
	const authDetails: string | null = localStorage.getItem(key);
	return authDetails ? JSON.parse(authDetails) : getDefaultAuthDetails();
}

/**
 * use `useAuth` instead
 */
// export function setAuthDetails(value: AuthDetails, key: string = localStorageAuthDetailsKey): AuthDetails {
// 	localStorage.setItem(key, JSON.stringify(value));
// 	return value;
// }
