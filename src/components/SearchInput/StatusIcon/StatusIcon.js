import React from 'react';

import classes from './StatusIcon.css';

const statusIcon = props => {
  const _status = () => {
    switch (props.status) {
      case 'idle':
        return classes.Idle;
        break;
      case 'searching':
        return classes.Searching;
        break;
      case 'error':
        return classes.Error;
        break;
      case 'success':
        return classes.Success
        break;
      default:
        return classes.Idle;
    }
  }
  return (
    <div className={classes.StatusIcon}>  
      <div className={[classes.Icon, _status()].join(' ')}></div>
    </div>
  )
};

export default statusIcon;
