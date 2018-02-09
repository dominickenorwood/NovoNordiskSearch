import React, { Component } from 'react';
import axios from 'axios';

import Helpers from '../../hoc/Helpers';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card';
import Monograph from '../../components/Monograph/Monograph';

import classes from './NovoNordiskSearch.css';

class NovoNordiskSearch extends Component {
  constructor() {
    super();

    this.state = {
      results: [],
      monograph: null,
      searchValue: '',
      status: 'idle',
      alert: false,
			headingId: null
    }

    this.spacebar = false;

    this.onInputChange = this.onInputChange.bind(this);
    this.resetState = this.resetState.bind(this);
    this.searchForMonograph = this.searchForMonograph.bind(this);
    this.getPremiumMonograph = this.getPremiumMonograph.bind(this);
    this.isEmphasised = this.isEmphasised.bind(this);
		this.resetHeadingId = this.resetHeadingId.bind(this);

    this.debounceSearch = Helpers.debounce(this.debounceSearch, 500);
  }

  toggleAlert() {
    this.state.alert ? this.setState({ alert : false }) : this.setState({ alert : true });
  }

  onInputChange(str) {
    const _split = str.split('');
    const _space = _split[_split.length - 1];
    const _search = this.state.searchValue.length;

    if(_space === ' ' && _split.length < 2){
      console.log('NO VALUE');
      return;
    } else {

      if(_space === ' ' && !this.spacebar) this.spacebar = true;
      else if (_space === ' ' && this.spacebar) return;
      else this.spacebar = false;

      this.setState({ searchValue : str });
    }

    if(_split.length >= 3){
      this.debounceSearch(str);
    } else {
      this.setState({results: [], monograph: null, status : 'idle', alert: false});
    }

  }

  isEmphasised(target, id, headingId) {
    if(target.tagName === 'EM') this.getPremiumMonograph(id, headingId);
  }

  resetState() {
    this.setState({results: [], monograph: null, searchValue: '', status : 'idle', alert: false, headingId: null});
  }

	resetHeadingId() {
		this.setState({ headingId: null })
	}

  debounceSearch(value){
    this.searchAPI(value);
    console.log('DEBOUNCE');
  }

  searchAPI(value) {
    console.log('SEARCH', encodeURI(value));
    this.setState({ status : 'searching' });
    axios.get(this.props.searchUrl, {
      params: {
        drugId : this.props.searchId,
        searchTerm : encodeURI(value)
      }
    })
    .then(response => {
      const _newResults = [ ...response.data.Results ];

      if(_newResults.length > 0) this.setState({ results : _newResults, monograph : null, status: 'success', alert: false });
      else this.setState({ results : [], monograph : null, status: 'searching', alert: true, headingId: null });

      console.log(`[Got response from ${this.props.searchUrl} for drugId ${this.props.searchId} and searchTerm "${value}".]`, response);
    })
    .catch(error => {
      this.setState({ results : [], monograph : null, status : 'error', alert: true, headingId: null });
      console.log(`[Error getting response from ${this.props.searchUrl}]`, error);
    });
  }

  searchForMonograph(char, value) {
    if(char === 13 && this.state.searchValue.length > 2){
			this.searchAPI(value);
    }
  }

  getPremiumMonograph(id, headingId) {
    this.setState({ status : 'searching' });
		if(headingId) this.setState({ headingId });
    axios.get(this.props.monographUrl, {
      params: {
				drugId: this.props.searchId,
        searchTerm : encodeURI(this.state.searchValue),
				fileId : id
      }
    })
    .then(response => {
      const _newMonograph = [response.data];
      this.setState({ results : [], monograph : _newMonograph, status : 'success' });
			if(headingId) this.setState({ headingId });
      console.log(response.data);
      console.log(`[Got response from ${this.props.monographUrl} for ID ${id} and searchTerm "${this.state.searchValue}".]`, response);
    })
    .catch(error => {
      this.setState({ status : 'error' });
      console.log(`[Error getting response from ${this.props.monographUrl}]`, error);
    })
  }

  render() {
    const _cards = this.state.results.map(card => {
      return (
        <Card
          key={card.FileId}
          title={card.Title}
          fileid={card.FileId}
          list={card.Headings}
          getMonograph={this.getPremiumMonograph}
          emphasisedClicked={this.isEmphasised} />
      )
    });

    let _monograph = null;
    if(this.state.monograph) {
      _monograph = <Monograph
                    title={this.state.monograph[0].Title}
                    headings={this.state.monograph[0].Headings}
                    fileid={this.state.monograph[0].FileId}
										stateHeadingId={this.state.headingId}
										resetHeadingId={this.resetHeadingId} />;
    };

    const _open = this.state.alert ? classes.Visible : null;

    return(
      <div className={classes.Module}>
        <div className={classes.Search}>
          <h5 className={classes.SearchHeading}>Search Premium Monographs</h5>
          <p className={classes.SearchBlurb}>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.</p>
          <SearchInput
            search={this.searchForMonograph}
            reset={this.resetState}
            value={this.state.searchValue}
            inputChange={this.onInputChange}
            status={this.state.status}/>
        </div>
        <div className={classes.Cards}>
          { _cards }
        </div>
        <div className={classes.Monographs}>
          { _monograph }
        </div>
        <div className={[classes.Alert, _open].join(' ')}>
          <span>No Results Found :(</span>
        </div>
      </div>
    );
  }
}

export default NovoNordiskSearch;
