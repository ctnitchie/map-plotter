import * as React from 'react';

export type ComponentStyle = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

function c(arr: string[]): string {
  return arr.filter(s => s).join(' ');
}

export interface BButtonProps {
  disabled?: boolean;
  size: ComponentSize;
  style?: ComponentStyle;
  outline?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export function BButton(props: BButtonProps) {
  const styleToken = (props.outline ? 'outline-' : '') + (props.style || 'primary');
  return (
    <button className={c(['btn', `btn-${styleToken}`, `btn-${props.size}`, props.className])}
        onClick={props.onClick} disabled={props.disabled} title={props.title}>
      {props.children}
    </button>
  )
}

export interface BButtonGroupProps {
  label?: string,
  className?: string,
  children: React.ReactNode
}

export function BButtonGroup(props: BButtonGroupProps) {
  return (
    <div className={c(['btn-group', props.className])} role="group" aria-label={props.label}>
      {props.children}
    </div>
  )
}
