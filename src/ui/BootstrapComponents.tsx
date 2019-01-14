import * as React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionFactory } from '../actionlib';

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
  icon?: IconDefinition;
}

export function BButton(props: BButtonProps) {
  const styleToken = (props.outline ? 'outline-' : '') + (props.style || 'primary');
  return (
    <button className={c(['btn', `btn-${styleToken}`, `btn-${props.size}`, props.className])}
        onClick={props.onClick} disabled={props.disabled} title={props.title}>
      {props.icon && <FontAwesomeIcon icon={props.icon}/>}
      {(props.icon && props.children) && ' '}
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

export interface BDlgButton {
  label: string;
  className?: string;
  action: ActionFactory<any>
}

export interface BDlgProps {
  title: string;
  buttons: BDlgButton[];
  body: React.ReactChild;
  visible: boolean;
  closable?: boolean;
}

export abstract class BDialogBody extends React.Component {
  dialogWillShow(): boolean | void {}
  dialogDidShow(): void {}
  dialogWillHide(): boolean | void {}
  dialogDidHide(): void {}
}

interface BDlgState {
  visible: boolean;
  transitioning: boolean;
}

const DFLT_DLG_STATE: BDlgState = {
  visible: false,
  transitioning: false
}

export class BDialog extends React.Component<BDlgProps, BDlgState> {
  readonly el: React.Ref<HTMLDivElement> = React.createRef();

  constructor(props: BDlgProps) {
    super(props);
    this.state = DFLT_DLG_STATE;
  }

  getInitialState() {
    return DFLT_DLG_STATE;
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div ref={this.el} className="modal" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.title}</h5>
              {this.props.closable !== false && (
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              {this.props.buttons.map(b => {

              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}