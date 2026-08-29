import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
}

export const SlideOver = ({ open, onClose, title, closeLabel, children }: SlideOverProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="slideover-overlay fixed inset-0 z-[60] bg-slate-900/10 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="slideover fixed top-0 right-0 z-[70] h-full w-80 overflow-y-auto border-l border-slate-200 bg-white shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <Dialog.Title className="text-sm font-extrabold text-slate-900">{title}</Dialog.Title>
            <Dialog.Close
              aria-label={closeLabel}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            >
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="space-y-6 p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
