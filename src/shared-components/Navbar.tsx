import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
	distractionless?: boolean;
}

export const Navbar: FC<Props> = ({ distractionless = false, ...props }) => {
	const { isAuthenticated, revokeAuth } = useAuth();
	const history = useHistory();

	return (
		<nav {...props} className="w-10/12 mx-auto pt-4">
			<ul className="flex text-2xl">
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
