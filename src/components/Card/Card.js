import React from 'react';

import Helpers from '../../hoc/Helpers';
import List from './List/List';
import classes from './Card.css';

const card = props => {

  const _list = props.list.map(item => {
    return (
      <List
        key={item.HeadingId}
        heading={item.Heading}
        content={item.Content}
        listId={item.HeadingId}
        dataId={props.fileid}
        getIdData={props.getMonograph}
        emClick={props.emphasisedClicked} />
    )
  })

  return (
    <div className={classes.Card}>
      <header className={classes.CardHeader} onClick={() => props.getMonograph(props.fileid, null)}>
        <h3 className={classes.CardHeading} dangerouslySetInnerHTML={Helpers.createMarkup(props.title)}></h3>
        <div className={classes.CardHeadingTag}>Powered by Novo Nordisk Medical Affairs</div>
        <span className={classes.drugid}>{props.fileid}</span>
      </header>
      <div className={classes.CardBody}>
        { _list }
      </div>
    </div>
  )
};

export default card;
