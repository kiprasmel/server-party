import React, { FC } from "react";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	issueTitle?: string;
	issueDescription?: string;
}

export const ReportAnIssueHref: FC<Props> = ({ issueTitle, issueDescription, children, ...props }) => (
	<a
		href={`https://github.com/sarpik/server-party/issues/new?title=${issueTitle}&body=${issueDescription}`}
		// eslint-disable-next-line react/jsx-no-target-blank
		target="_blank"
		rel="noopener"
		className="text-party-purple"
		{...props}
	>
		{children}
	</a>
);
