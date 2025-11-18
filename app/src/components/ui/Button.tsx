import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
    {
        variants: {
            variant: {
                primary: 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(6,182,212,0.4)]',
                secondary: 'bg-slate-700/30 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50',
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
