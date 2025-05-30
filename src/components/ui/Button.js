import React from "react";
import clsx from "clsx";

export function Button({ children, className, ...props }) {
	return (
		<button
			className={clsx(
				"bg-bg hover:bg-bg-3 border border-border items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none px-6 py-2",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export function PrimaryButton({ children, className, ...props }) {
	return (
		<Button
			className={clsx(
				"bg-primary text-primary-fg border-border-primary hover:bg-primary-2",
				className
			)}
			{...props}
		>
			{children}
		</Button>
	);
}
