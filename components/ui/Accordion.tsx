import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = []
}: any) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter((id: any) => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      );

  };

  return (
    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
      {items.map((item: any) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div key={item.id} className="glass-pane overflow-hidden sm:px-4 md:px-6 lg:px-8">
            <button
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              aria-controls={`content-${item.id}`}
            >
              <span className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8"
              >
                ▼
              </motion.span>
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden sm:px-4 md:px-6 lg:px-8"
                >
                  <div className="px-4 pb-3 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};