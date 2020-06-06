export interface AuthDetails {
	username: string;
	bearerToken: string;
}

export const getDefaultAuthDetails = () => ({ bearerToken: "", username: "" });

export const localStorageAuthDetailsKey: string = "__auth_details";
