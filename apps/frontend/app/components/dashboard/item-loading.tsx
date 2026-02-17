interface ItemLoadingProps {
  message?: string;
}

export function ItemLoading({ message = 'Loading items...' }: ItemLoadingProps) {
  return <div className="py-8 text-center text-[--color-muted]">{message}</div>;
}
