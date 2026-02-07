interface CampaignErrorProps {
  error: Error;
}

export function CampaignError({ error }: CampaignErrorProps) {
  return (
    <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
      {error.message}
    </div>
  );
}
