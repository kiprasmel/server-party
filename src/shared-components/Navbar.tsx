import React, { FC } from "react";
import { Link } from "react-router-dom";

export const Navbar: FC = (props) => (
	<nav {...props} className="w-10/12 mx-auto pt-4">
		<ul className="flex text-2xl">
			<li className="my-auto">
				<h1 className="uppercase">
					<Link to="/">Server Party</Link>
				</h1>
			</li>
			<li className="ml-auto border border-gray-500 rounded">
				<Link to="/login" className="inline-block px-3 py-1">
					Log in
				</Link>
			</li>
		</ul>
	</nav>
);
