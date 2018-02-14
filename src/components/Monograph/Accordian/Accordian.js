import React, { Component } from 'react';
//import CSSTransition from 'react-transition-group/CSSTransition';
import Transition from 'react-transition-group/Transition';

import Helpers from '../../../hoc/Helpers';
import PlusIcon from '../../../svg/PlusIcon';
import MinusIcon from '../../../svg/MinusIcon';

import classes from './Accordian.css';

const animationTiming = {
  enter: 500,
  exit: 50
}

class Accordian extends Component {
  constructor() {
    super();

    this.state = {
      open : false
    }

    this.toggleAccordian = this.toggleAccordian.bind(this);
    this.transitionStyles = this.transitionStyles.bind(this);
  }

  toggleAccordian() {
    if(this.doIdsMatch) {
      this.props.resetAccordianId();
      this.setState({ open : false})
    } else {
      this.state.open ? this.setState({ open : false}) : this.setState({ open : true});
    }
  }

  componentWillMount() {
    console.log('[Accordian] Will Mount');
    if(this.doIdsMatch){
      
    }
  }

  componentDidMount() {
    console.log(`[Accordian] Did Mount`);
    if(this.doIdsMatch) {
      this.setState({ open : true})
      const _accordian = document.getElementById(`novo-search-accordian-${this.props.accordianId}`);

      console.log(`Scroll to accordian => ${this.props.accordianId}`);
      console.log(_accordian.offsetTop);

      window.scrollTo(0, _accordian.offsetTop)
    }
  }

  transitionStyles(tempHeight) {
    return [{
      entering: { height : `${tempHeight}px`},
      exiting:  { height : '0'}
    }];
  }

  get accordianHeight () {
    return this.refs.accordianTransition.refs.accordianWrapper.offsetHeight;
  }

  get doIdsMatch() {
    return this.props.accordianId === this.props.stateAccordianId
  }

  render() {
    const _current = ( this.state.open || this.doIdsMatch ) ? classes.Current : null;
    const _minus = ( this.state.open || this.doIdsMatch ) ? classes.Visible : null;
    const _plus = ( this.state.open || this.doIdsMatch ) ? null : classes.Visible;

    return (
      <div id={`novo-search-accordian-${this.props.accordianId}`} className={classes.Accordian} data-accordian={this.props.accordianId}>
        <header className={[classes.Header, _current].join(' ')} onClick={this.toggleAccordian}>
          <span className={classes.HeadingWrap} dangerouslySetInnerHTML={Helpers.createMarkup(this.props.heading)}></span>
          <span className={classes.Icons}>
            <PlusIcon symbolClass={[classes.Symbol, _plus].join(' ')} />
            <MinusIcon symbolClass={[classes.Symbol, _minus].join(' ')} />
          </span>       
        </header>
        <Transition
          in={this.state.open}
          timeout={animationTiming}
          onExited={() => console.log('EXITED BRO',this)}
          ref="accordianTransition">
          {
            state => {
              let _styles = null;
              let _classes = null;

              if(state === 'entering' || state === 'entered' || state === 'exiting'){
                console.log('EXPAND accordian to ', this.accordianHeight)
                _styles = { height : `${this.accordianHeight}px`}
              }

              if (state === 'entered'){
                _classes = classes.HeightAuto;
              }

              return (
                <div ref="accordianBody" className={[classes.Body, _classes].join(' ')} style={_styles}>
                  <div className={classes.BodyWrapper} ref="accordianWrapper" dangerouslySetInnerHTML={Helpers.createMarkup(this.props.content[0])}></div>
                </div>
              )
            } 
          }                
        </Transition>     
      </div>
    )
  }
}


export default Accordian;
