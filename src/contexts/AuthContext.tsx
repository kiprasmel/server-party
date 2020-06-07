import React, { FC } from "react";

import { getDefaultAuthDetails } from "../models/AuthDetails";
import { useAuth, UseAuthRet } from "../hooks/useAuth";

const invalidUsageMessage: string =
	"noop - you're using the raw `AuthContext` as your provider. It needs a proper value from `useAuth` - you should provide it or use `AuthContextWrapper` as your provider instead";

const initialInvalidContextValue = {
	auth: getDefaultAuthDetails(),
	isAuthenticated: false,
	setAuth: () => {
		throw new Error(invalidUsageMessage);
	},
	revokeAuth: () => {
		throw new Error(invalidUsageMessage);
	},
	redirectToLoginIfNoAuth: () => {
		throw new Error(invalidUsageMessage);
	},
};

/**
 * Simply wraps the custom `useAuth` hook
 * since we need to store the authentication somewhere anyway
 * (atm. `useAuth` uses localStorage under the hood)
 */
export const AuthContext = React.createContext<UseAuthRet>(initialInvalidContextValue);

export const AuthContextWrapper: FC = ({ children }) => {
	console.log("re-render ctx");
	const authFromLocalStorage = useAuth();

	return <AuthContext.Provider value={authFromLocalStorage}>{children}</AuthContext.Provider>;
};
