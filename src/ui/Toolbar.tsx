import * as React from 'react';
import * as actions from '../actions';
import { ActionCreator, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { BButtonProps, BButtonGroup, BButton } from './BootstrapComponents';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

function connectButton(a: ActionCreator<any>, stateHandler?: (state: State, ownProps: BButtonProps) => BButtonProps) {
  const dispatchToProps = (dispatch: Dispatch) => {
    return {
      onClick: () => dispatch(a())
    };
  }
  return connect(stateHandler, dispatchToProps)(BButton);
}

const NewButton = connectButton(actions.tryClear);
const ResetButton = connectButton(actions.tryReset);

export function Toolbar() {
  return (
    <div className="btn-toolbar" id="toolbar">
      <BButtonGroup>
        <NewButton style="success" size="sm" icon={faFile} title="New Map"/>
        <ResetButton style="danger" size="sm" icon={faUndo} title="Reset Map"/>
      </BButtonGroup>
    </div>
  );
}