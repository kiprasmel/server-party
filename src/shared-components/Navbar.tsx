import React, { FC, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	distractionless?: boolean;
}

export const Navbar: FC<Props> = ({ distractionless = false, ...props }) => {
	const {
		auth: { isAuthenticated },
		revokeAuth,
	} = useContext(AuthContext);

	const history = useHistory();

	return (
		<nav {...props} className="wrapper pt-8 | md:pt-12">
			<ul className="flex text-2xl -mr-3">
				<li className="my-auto">
					<h1 className="uppercase">
						<Link to="/">Server Party</Link>
					</h1>
				</li>

				{!distractionless && (
					<li className="ml-auto">
						{isAuthenticated ? (
							<button
								type="button"
								onClick={() => {
									revokeAuth();
									history.push("/");
								}}
								className="inline-block px-3 py-1 text-lg"
							>
								Log off
							</button>
						) : (
							<Link to="/login" className="inline-block px-3 py-1 border border-gray-500 rounded">
								Log in
							</Link>
						)}
					</li>
				)}
			</ul>
		</nav>
	);
};
