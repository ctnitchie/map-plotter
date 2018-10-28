import * as React from 'react';

export type ComponentStyle = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface BButtonProps {
  disabled?: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg';
  style?: ComponentStyle;
  outline?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode
}

export function BButton(props: BButtonProps) {
  const styleToken = (props.outline ? 'outline-' : '') + (props.style || 'primary');
  const c = `btn btn-${styleToken} btn-${props.size} ${props.className || ''}`;
  return (
    <button className={c} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  )
}
