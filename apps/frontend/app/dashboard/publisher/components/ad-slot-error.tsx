interface AdSlotErrorProps {
  error: Error;
}

export function AdSlotError({ error }: AdSlotErrorProps) {
  return (
    <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
      {error.message}
    </div>
  );
}
