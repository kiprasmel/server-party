import { useHistory } from "react-router-dom";

import { useLocalStorage } from "./useLocalStorage";
import { AuthDetails, localStorageAuthDetailsKey, getDefaultAuthDetails } from "../models/AuthDetails";

export interface UseAuthRet {
	auth: AuthDetails;
	setAuth: React.Dispatch<AuthDetails>;
	revokeAuth: () => void;
	isAuthenticated: boolean;
	redirectToLoginIfNoAuth: (from?: string, redirectHumanMsg?: string) => void;
}

export function useAuth(
	authDetails: AuthDetails = getDefaultAuthDetails(),
	localStorageKey: string = localStorageAuthDetailsKey
): UseAuthRet {
	const [auth, setAuth] = useLocalStorage<AuthDetails>(localStorageKey, authDetails);

	const isAuthenticated: boolean = !!auth.bearerToken?.trim();

	const revokeAuth = (): void => setAuth(getDefaultAuthDetails());

	const history = useHistory();

	const redirectToLoginIfNoAuth = (
		from: string = "/party",
		redirectHumanMsg: string = "Whoopsies, looks like you'll have to login first..."
	): void => {
		if (!auth?.bearerToken) {
			history.replace("/login", {
				from,
				redirectHumanMsg,
			});
		}
	};

	return { auth, setAuth, revokeAuth, isAuthenticated, redirectToLoginIfNoAuth };
}
