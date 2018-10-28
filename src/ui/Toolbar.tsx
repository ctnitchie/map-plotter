import * as React from 'react';
import * as actions from '../actions';
import { Action } from '../actionlib';
import { ActionCreator, Dispatch } from 'redux';
import { connect, InferableComponentEnhancer, MapStateToPropsParam } from 'react-redux';
import { State } from '../reducers';
import { BButtonProps, BButtonGroup, BButton } from './BootstrapComponents';

function connectButton(a: ActionCreator<any>, stateHandler?: (state: State, ownProps: BButtonProps) => BButtonProps) {
  const stateToProps = stateHandler || ((state: State, ownProps: BButtonProps) => {});
  const dispatchToProps = (dispatch: Dispatch) => {
    return {
      onClick: () => dispatch(a())
    };
  }
  return connect(stateToProps, dispatchToProps)(BButton);
}

const NewButton = connectButton(actions.tryClear);
const ResetButton = connectButton(actions.tryReset);

export function Toolbar() {
  return (
    <div className="btn-toolbar" id="toolbar">
      <BButtonGroup>
        <NewButton style="danger" size="sm">New Map</NewButton>
        <ResetButton style="secondary" size="sm">Reset</ResetButton>
      </BButtonGroup>
    </div>
  );
}