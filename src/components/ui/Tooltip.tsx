import * as RTooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

export const TooltipProvider = RTooltip.Provider;

export const Tooltip = ({ content, children }: { content: ReactNode; children: ReactNode }) => {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side="top"
          sideOffset={6}
          className="z-30 w-max px-2 py-1 bg-slate-800 text-white text-xs font-bold rounded shadow pointer-events-none"
        >
          {content}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
};
