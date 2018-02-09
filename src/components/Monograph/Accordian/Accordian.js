import React, { Component } from 'react';

import Helpers from '../../../hoc/Helpers';
import PlusIcon from '../../../svg/PlusIcon';
import MinusIcon from '../../../svg/MinusIcon';

import classes from './Accordian.css';


class Accordian extends Component {
  constructor() {
    super();

    this.state = {
      open : false
    }

    this.toggleAccordian = this.toggleAccordian.bind(this);
  }

  toggleAccordian() {
    if(this.props.accordianId === this.props.stateAccordianId) {
      this.props.resetAccordianId();
    } else {
      this.state.open ? this.setState({ open : false }) : this.setState({ open : true });
    }
  }

  componentDidMount() {
    console.log(`[Accordian] Did Mount`);
    if(this.props.accordianId === this.props.stateAccordianId) {
      const _accordian = document.getElementById(`novo-search-accordian-${this.props.accordianId}`)
      console.log(`Scroll to accordian => ${this.props.accordianId}`);
      console.log(_accordian.offsetTop);
      window.scrollTo(0, _accordian.offsetTop)
    }
  }

  render() {
    const _open = ( this.state.open || this.props.accordianId === this.props.stateAccordianId ) ? classes.Visible : null;
    const _minus = ( this.state.open || this.props.accordianId === this.props.stateAccordianId ) ? classes.Visible : null;
    const _plus = ( this.state.open || this.props.accordianId === this.props.stateAccordianId ) ? null : classes.Visible;

    return (
      <div id={`novo-search-accordian-${this.props.accordianId}`} className={classes.Accordian} data-accordian={this.props.accordianId}>
        <header className={classes.Header} onClick={this.toggleAccordian}>
          <span className={classes.HeadingWrap} dangerouslySetInnerHTML={Helpers.createMarkup(this.props.heading)}></span>
          <PlusIcon symbolClass={[classes.Symbol, _plus].join(' ')} />
          <MinusIcon symbolClass={[classes.Symbol, _minus].join(' ')} />
        </header>
        <div
          className={[classes.Body, _open].join(' ')}
          dangerouslySetInnerHTML={Helpers.createMarkup(this.props.content[0])}>
        </div>
      </div>
    )
  }
}


export default Accordian;
