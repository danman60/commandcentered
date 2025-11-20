import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
    'bg-slate-700/50 border border-slate-600/30 rounded-xl transition-all duration-200',
    {
        variants: {
            padding: {
                none: '',
                small: 'p-4',
                medium: 'p-5',
                large: 'p-6',
            },
            hover: {
                none: '',
                lift: 'hover:border-green-600/50 hover:-translate-y-0.5',
                glow: 'hover:border-green-600/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]',
            },
        },
        defaultVariants: {
            padding: 'medium',
            hover: 'lift',
        },
    }
);

interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {
    children: ReactNode;
}

export function Card({ children, padding, hover, className, ...props }: CardProps) {
    return (
        <div className={cardVariants({ padding, hover, className })} {...props}>
            {children}
        </div>
    );
}
