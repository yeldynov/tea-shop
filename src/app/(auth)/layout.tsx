export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-prose section-sm">
      <div className="mx-auto flex max-w-md flex-col gap-8">{children}</div>
    </div>
  );
}
