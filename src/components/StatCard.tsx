interface StatCardProps {
  title: string;
  value: string;
  description: string;
  accentClassName?: string;
}

export function StatCard({
  title,
  value,
  description,
  accentClassName = "from-brand-blue to-brand-navy"
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClassName}`}
      />
      <div className="flex h-full flex-col justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-[clamp(1.5rem,2vw,2.4rem)] font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
