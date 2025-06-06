import Link from "next/link";

export default function Footer() {
  return (
    <nav className="flex justify-center px-4 py-8 border-t border-neutral-800 bg-bg">
      <div className="flex row justify-between w-full max-w-5xl gap-8 text-neutral-600">
        <ul className="flex row gap-8">
          <li>
            <Link href="/terms" className="hover:text-blue-400 duration-300">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-blue-400 duration-300">
              Privacy Policy
            </Link>
          </li>
        </ul>
        <div>© 2025</div>
      </div>
    </nav>
  );
}
