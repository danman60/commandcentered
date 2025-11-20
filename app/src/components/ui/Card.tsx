import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
    'tactical-card rounded-xl transition-all duration-200',
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
                lift: 'hover:-translate-y-1',
                glow: 'hover:tactical-border-intense',
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
