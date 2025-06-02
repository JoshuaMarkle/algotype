export default function Page() {
  const colorVars = [
    "--color-bg",
    "--color-bg-2",
    "--color-bg-3",
    "--color-bg-4",
    "--color-bg-5",
    "--color-fg",
    "--color-fg-2",
    "--color-fg-3",
    "--color-primary",
    "--color-primary-2",
    "--color-border-primary",
    "--color-destructive",
    "--color-descructive-2",
    "--color-border-destructive",
    "--color-border-subtle",
    "--color-border-default",
    "--color-border-strong",
  ];

  return (
    <main className="min-h-screen p-8 bg-[var(--background)] text-[var(--foreground)] font-sans space-y-12">
      <section>
        <h1 className="text-2xl font-bold mb-4">Color Variables</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {colorVars.map((name) => (
            <div
              key={name}
              className="rounded-xl shadow p-4 flex items-center justify-between"
              style={{
                backgroundColor: `var(${name})`,
                color: name.includes("fg") ? "black" : "white",
              }}
            >
              <span className="text-sm font-mono">{name}</span>
              <span
                className="w-5 h-5 rounded-full border border-white"
                style={{ backgroundColor: `var(${name})` }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border rounded-lg p-8">
        <h2 className="text-6xl font-bold mb-4">Typography Examples</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-semibold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <h4 className="text-xl font-medium">Heading 4</h4>
          <h5 className="text-lg font-medium">Heading 5</h5>
          <p className="text-base mt-8 text-fg">Paragraph – fg</p>
          <p className="text-base text-fg-2">Paragraph – fg-2</p>
          <p className="text-base text-fg-3">Paragraph – fg-3</p>
          <pre>Monospace text example...text in a pre</pre>
          <span className="font-geist-mono font-mono">
            Monospace text example...explicitly classed font-mono
          </span>
        </div>
      </section>

      <section className="border border-border rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 rounded-lg font-medium shadow bg-primary text-primary-fg border border-border-primary hover:bg-primary-2">
            Primary Button
          </button>

          <button className="px-4 py-2 rounded-lg font-medium shadow bg-destructive text-descructive-fg border border-border-destructive hover:bg-descructive-2">
            Destructive Button
          </button>
        </div>
      </section>

      <section className="flex flex-row gap-8">
        <div className="h-16 border border-border-subtle flex rounded-lg flex-grow items-center justify-center">
          Subtle
        </div>
        <div className="h-16 border border-border flex rounded-lg flex-grow items-center justify-center">
          Default
        </div>
        <div className="h-16 border border-border-strong flex rounded-lg flex-grow items-center justify-center">
          Strong
        </div>
      </section>
      <section className="flex flex-row gap-8">
        <div className="h-16 border border-border-subtle flex rounded-lg flex-grow items-center justify-center">
          Subtle
        </div>
        <div className="h-16 border border-border flex rounded-lg flex-grow items-center justify-center bg-bg-2">
          Default
        </div>
        <div className="h-16 border border-border-strong flex rounded-lg flex-grow items-center justify-center bg-bg-3">
          Strong
        </div>
      </section>
    </main>
  );
}
