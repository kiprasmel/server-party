import React, { FC, useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

interface Props extends RouteProps {
	component: any;
	redirectHumanMsg?: string;
}

export const PrivateRoute: FC<Props> = ({ component: Component, redirectHumanMsg, ...rest }) => {
	const {
		auth: { isAuthenticated },
	} = useContext(AuthContext);

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
