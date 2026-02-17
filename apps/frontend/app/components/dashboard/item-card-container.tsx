import { ReactNode } from 'react';

interface ItemCardContainerProps {
  name: string;
  description: string | null;
  badge?: ReactNode;
  children: ReactNode;
}

export function ItemCardContainer({ name, description, badge, children }: ItemCardContainerProps) {
  return (
    <div className="rounded-lg border border-[--color-border] p-4">
      {/* Card Header */}
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-semibold">{name}</h3>
        {/* Card Badge */}
        {badge}
      </div>

      {/* card Description */}
      {description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{description}</p>
      )}

      {/* card body */}
      {children}

      {/* TODO: Add edit/toggle availability buttons */}
    </div>
  );
}
