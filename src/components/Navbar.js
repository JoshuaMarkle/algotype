export default function Navbar() {
	return (
		<nav className="flex justify-center p-4 border-b border-neutral-800">
			<div className="w-full flex items-center justify-between max-w-5xl">
				<div>AlgoType</div>
				<ul className="flex gap-4">
					<li>
						<a href="/" className="hover:text-blue-400 transition">Home</a>
					</li>
					<li>
						<a href="/about" className="hover:text-blue-400 transition">About</a>
					</li>
					<li>
						<a href="/contact" className="hover:text-blue-400 transition">Contact</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
