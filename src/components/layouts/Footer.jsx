export default function Footer() {
  return (
    <nav className="flex justify-center px-4 py-8 mt-8 border-t border-neutral-800">
      <div className="flex row justify-between w-full max-w-5xl gap-8 text-neutral-600">
        <ul className="flex row gap-8">
          <li>
            <a href="/terms" className="hover:text-blue-400 duration-300">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:text-blue-400 duration-300">
              Privacy Policy
            </a>
          </li>
        </ul>
        <div>© 2025</div>
      </div>
    </nav>
  );
}
