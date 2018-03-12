import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';

import Helpers from '../../hoc/Helpers';
import List from './List/List';
import ExpandIcon from '../../svg/ExpandIcon';

import classes from './Card.css';

const animationTiming = {
  enter: 500,
  exit: 50
}

class Card extends Component {
  constructor(){
    super();

    this.state = {
      open: false
    }

    this.toggleAccordian = this.toggleAccordian.bind(this);
  }

  toggleAccordian() {
    this.state.open ? this.setState({ open : false }) : this.setState({ open : true });
  }

  transitionStyles(tempHeight){
    return [{
      entering: {height : `${tempHeight}px`},
      exiting: {height : '0'}
    }]
  }

  get cardBodyHeight() {
    return this.refs.cardTransition.refs.cardBodyWrapper.offsetHeight;
  }

  render(){

    const _list = this.props.list.map(item => {
      return (
        <List
          key={item.HeadingId}
          heading={item.Heading}
          content={item.Content}
          listId={item.HeadingId}
          dataId={this.props.fileid}
          getIdData={() => this.props.getMonograph(this.props.fileid, item.HeadingId, this.props.title, item.Heading)}
          emClick={this.props.emphasisedClicked} />
      )
    });

    return(
      <div className={classes.Card}>
        <header className={classes.CardHeader} >
          <div className={classes.Text}>
            <h3 
              className={classes.CardHeading} 
              dangerouslySetInnerHTML={Helpers.createMarkup(this.props.title)}
              onClick={() => this.props.getMonograph(this.props.fileid, null, this.props.title)}></h3>
            <div className={classes.CardHeadingTag}>Powered by Novo Nordisk Medical Affairs</div>
          </div>
          <div className={classes.Icon} onClick={this.toggleAccordian}>
            <ExpandIcon symbolClass={classes.Symbol} />
          </div>
        </header>
        <Transition
          in={this.state.open}
          timeout={animationTiming}
          ref='cardTransition'>
            {
              state => {
                let _styles = null;
                let _classes = null;

                if(state === 'entering' || state === 'entered' || state === 'exiting'){
                  _styles = { height : `${this.cardBodyHeight}px`}
                }
  
                if (state === 'entered'){
                  _classes = classes.HeightAuto;
                }

                return (
                  <div className={[classes.CardBody, _classes].join(' ')} style={_styles}>
                    <div className={classes.CardBodyWrapper} ref="cardBodyWrapper">
                      { _list }
                    </div>
                  </div>
                )
              }
            }
        </Transition>
      </div>
    )
  }
}


export default Card;
