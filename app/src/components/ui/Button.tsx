import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden',
    {
        variants: {
            variant: {
                primary: 'tactical-button-primary',
                secondary: 'tactical-button text-slate-200',
            },
            size: {
                small: 'px-4 py-2 text-sm',
                medium: 'px-5 py-3 text-sm',
                large: 'px-6 py-3 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'medium',
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode;
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
    return (
        <button className={buttonVariants({ variant, size, className })} {...props}>
            {children}
        </button>
    );
}
