export function Step({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6">
      <div className="text-3xl font-semibold text-amber-200">{num}</div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/80">{body}</div>
    </div>
  );
}
