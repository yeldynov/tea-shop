export function TastingNotes({ notes, label = "Tasting notes" }: { notes: string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {notes.map((note) => (
        <li
          key={note}
          className="rounded-pill border border-matcha/25 bg-cream/60 px-3.5 py-1.5 text-sm text-matcha-deep"
        >
          {note}
        </li>
      ))}
    </ul>
  );
}
