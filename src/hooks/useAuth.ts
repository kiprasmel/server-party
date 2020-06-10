import { useLocalStorage } from "./useLocalStorage";
import { AuthDetails, localStorageAuthDetailsKey, getDefaultAuthDetails } from "../models/AuthDetails";

export interface UseAuthRet {
	auth: AuthDetails;
	setAuth: React.Dispatch<AuthDetails>;
	revokeAuth: () => void;
	isAuthenticated: boolean;
}

export function useAuth(
	authDetails: AuthDetails = getDefaultAuthDetails(),
	localStorageKey: string = localStorageAuthDetailsKey
): UseAuthRet {
	const [auth, setAuth] = useLocalStorage<AuthDetails>(localStorageKey, authDetails);

	const isAuthenticated: boolean = !!auth.bearerToken?.trim();

	const revokeAuth = (): void => setAuth(getDefaultAuthDetails());

	return { auth, setAuth, revokeAuth, isAuthenticated };
}
