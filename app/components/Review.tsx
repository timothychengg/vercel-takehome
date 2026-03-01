export function Review({ stars, text }: { stars: number; text: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/12 p-5 text-center">
      <div className="flex items-center justify-center gap-4">
        <div className="font-semibold">Anonymous</div>
        <div className="text-amber-200 text-sm">{"★".repeat(stars)}</div>
      </div>
      <div className="mt-2 text-sm text-white/85">{text}</div>
    </div>
  );
}
