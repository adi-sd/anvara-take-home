interface ItemErrorProps {
  error: Error | string;
}

export function ItemError({ error }: ItemErrorProps) {
  return (
    <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
      {typeof error === 'string' ? error : error.message}
    </div>
  );
}
