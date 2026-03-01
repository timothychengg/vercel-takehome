export function Review({ name, stars, text }: { name?: string; stars: number; text: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/12 p-5">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{name ?? 'Anonymous'}</div>
        <div className="text-amber-200 text-sm">{"★".repeat(stars)}</div>
      </div>
      <div className="mt-2 text-sm text-white/85">{text}</div>
    </div>
  );
}
