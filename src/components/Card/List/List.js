import React from 'react';

import Helpers from '../../../hoc/Helpers';

import classes from './List.css';

const list = props => {
  let _unorderedList = null;

  const _items = props.content.map((item, index) => {
    return (
      <li
        key={`${props.listId}-${index}`}
        className={classes.CardInnerListItem}
        dangerouslySetInnerHTML={Helpers.createMarkup(item)}
        onClick={(event) => props.emClick(event.target, props.dataId, props.listId)}></li>
    )
  });

  if( _items.length > 0 ) {
    _unorderedList = (
      <ul className={classes.CardInnerList}>
         { _items }
      </ul>
    )
  }

  return (
    <ul className={classes.CardList}>
      <li
        className={classes.CardListHeading}
        dangerouslySetInnerHTML={Helpers.createMarkup(props.heading)}
        onClick={() => props.getIdData(props.dataId, props.listId)}></li>
      { _unorderedList }
    </ul>
  )
}

export default list;
