export function OrDivider() {
  return (
    <div className="flex items-center gap-4 text-ink-faint" role="separator">
      <hr className="divider flex-1" />
      <span className="label">or</span>
      <hr className="divider flex-1" />
    </div>
  );
}
