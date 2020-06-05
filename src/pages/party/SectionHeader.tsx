import React, { FC } from "react";

/**
 * used to create a negative margin @ the header,
 * I placed it here to clearly show the intent.
 *
 * You can customize the value, obviously.
 */
const buttonPaddingXValue: number | string = 2;

interface HeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	title: string;
}

export const SectionHeader: FC<HeaderProps> = ({ title, children, ...props }) => (
	<header className="flex justify-between border-b-2 text-base" {...props}>
		<h2 className="-mb-2px pb-3 border-b-2 border-party-purple uppercase text-gray-800 font-bold pointer-events-none">
			{title}
		</h2>

		<div className={`-mr-${buttonPaddingXValue} space-x-2`}>{children}</div>
	</header>
);

interface ButtonProps
	extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	/** for extending */
	extraClassName?: string;

	/** for completely overriding */
	className?: string;
}

export const SectionHeaderButton: FC<ButtonProps> = ({ extraClassName = "", children, ...props }) => (
	<button
		type="button"
		className={[`px-${buttonPaddingXValue} py-2 mb-1 -mt-3 text-party-purple`, extraClassName].join(" ")}
		{...props}
	>
		{children}
	</button>
);
