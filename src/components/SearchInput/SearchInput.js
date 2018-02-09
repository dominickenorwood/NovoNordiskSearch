import React from 'react';

import StatusIcon from './StatusIcon/StatusIcon';

import classes from './SearchInput.css';

const searchInput = props => (
  <div className={classes.InputWrapper}>
    <input
      className={classes.TextInput}
      type="text"
      placeholder="Start to type to see results appear below"
      value={props.value}
      onChange={(event) => props.inputChange(event.target.value)}
      onKeyPress={(event) => props.search(event.charCode, event.target.value)} />
    <button className={classes.Button} type="Button" onClick={() => props.reset()}>Reset</button>
    <StatusIcon status={props.status} />
  </div>
);

export default searchInput;
