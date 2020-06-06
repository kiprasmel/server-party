import { useLocalStorage } from "./useLocalStorage";
import { AuthDetails, localStorageAuthDetailsKey } from "../models/AuthDetails";

export function useAuth(): [AuthDetails, React.Dispatch<AuthDetails>] {
	const [auth, setAuth] = useLocalStorage<AuthDetails>(localStorageAuthDetailsKey, { bearerToken: "", username: "" });

	return [auth, setAuth];
}
