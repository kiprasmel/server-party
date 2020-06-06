export interface AuthDetails {
	username: string;
	bearerToken: string;
}

export const localStorageAuthDetailsKey: string = "__auth_details";
