export interface AuthDetails {
	username: string;
	bearerToken: string;
	isAuthenticated: boolean;
}

export const getDefaultAuthDetails = (): AuthDetails => ({ bearerToken: "", username: "", isAuthenticated: false });

export const localStorageAuthDetailsKey: string = "__auth_details";
