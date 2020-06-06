import { useLocalStorage } from "./useLocalStorage";
import { AuthDetails, localStorageAuthDetailsKey, getDefaultAuthDetails } from "../models/AuthDetails";

export function useAuth(): {
	auth: AuthDetails;
	setAuth: React.Dispatch<AuthDetails>;
	revokeAuth: () => void;
	isAuthenticated: boolean;
	// eslint-disable-next-line indent
} {
	const [auth, setAuth] = useLocalStorage<AuthDetails>(localStorageAuthDetailsKey, getDefaultAuthDetails());

	const isAuthenticated: boolean = !!auth.bearerToken?.trim();

	const revokeAuth = (): void => setAuth(getDefaultAuthDetails());

	return { auth, setAuth, revokeAuth, isAuthenticated };
}
