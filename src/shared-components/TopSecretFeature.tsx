import React, { FC } from "react";

export const TopSecretFeature: FC = ({ children, ...props }) => (
	<a
		/** ¯\_(ツ)_/¯ */
		href="https://go.kipras.org/party"
		target="_blank"
		rel="noopener noreferrer"
		className="underline italic text-gray-700"
		{...props}
	>
		{children}
	</a>
);
