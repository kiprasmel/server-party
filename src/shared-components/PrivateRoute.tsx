import React, { FC } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props extends RouteProps {
	component: any;
	redirectHumanMsg?: string;
}

export const PrivateRoute: FC<Props> = ({ component: Component, redirectHumanMsg, ...rest }) => {
	const { isAuthenticated } = useAuth();

	console.log("isAuth", isAuthenticated);

	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location, redirectHumanMsg },
						}}
					/>
				)
			}
		/>
	);
};
