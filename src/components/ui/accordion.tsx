'use client';

import { useState, useRef, useEffect } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : '0px');

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
      const timer = setTimeout(() => setHeight('auto'), 200);
      return () => clearTimeout(timer);
    } else {
      setHeight(`${contentRef.current.scrollHeight}px`);
      requestAnimationFrame(() => setHeight('0px'));
    }
  }, [isOpen]);

  return (
    <div className="border-b border-hl-primary/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-hl-primary hover:text-hl-accent transition-colors"
      >
        {title}
        <svg
          className={`h-4 w-4 shrink-0 text-hl-primary/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        role="region"
        style={{ height, overflow: 'hidden', transition: 'height 0.2s ease-in-out' }}
      >
        <div ref={contentRef} className="pb-4 text-sm text-hl-primary/70 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
