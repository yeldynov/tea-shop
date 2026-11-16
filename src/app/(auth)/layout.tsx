// Reads the session (cookies), so it may block; see the note in app/cart/page.tsx.
export const instant = false;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-prose section-sm">
      <div className="mx-auto flex max-w-md flex-col gap-8">{children}</div>
    </div>
  );
}
