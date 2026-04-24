import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'ghost';
type Size = 'default' | 'sm' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = 'default', size = 'default', className, children, ...rest }: ButtonProps) {
  const classes = [
    'btn',
    variant !== 'default' && `btn--${variant}`,
    size !== 'default' && `btn--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return <button className={classes} {...rest}>{children}</button>;
}
