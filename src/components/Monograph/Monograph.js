import React from 'react';

import Accordian from './Accordian/Accordian';
import classes from './Monograph.css';

const monograph = props => {

  const _accordians = props.headings.map((accordian, index) => {
    return <Accordian
              key={`${props.fileid}-${index}`}
              heading={accordian.Heading}
              content={accordian.Content}
              accordianId={accordian.HeadingId}
              stateAccordianId={props.stateHeadingId}
              resetAccordianId={props.resetHeadingId} />
  });

  return (
    <div className={classes.Monograph}>
      <header className={classes.Header}>
        <h3 className={classes.Heading}>{props.title}</h3>
        <div className={classes.HeadingTag}>Powered by Novo Nordisk Medical Affairs</div>
      </header>
      <div className={classes.Accordians}>
        { _accordians }
      </div>
    </div>
  )
};

export default monograph;