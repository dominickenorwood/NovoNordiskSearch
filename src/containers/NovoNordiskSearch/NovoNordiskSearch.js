import React, { Component } from 'react';
import axios from 'axios';
import Transition from 'react-transition-group/Transition';

import Helpers from '../../hoc/Helpers';
import SearchInput from '../../components/SearchInput/SearchInput';
import Card from '../../components/Card/Card';
import Monograph from '../../components/Monograph/Monograph';
import PDFIcon from '../../svg/PDFIcon';

import classes from './NovoNordiskSearch.css';

const animationTiming = {
  enter: 1000,
  exit: 1000
}


class NovoNordiskSearch extends Component {
  constructor() {
    super();

    this.state = {
      results: [],
      monograph: null,
      searchValue: decodeURI(this.getURLParam('searchTerm')),
      status: 'idle',
      alert: false,
      headingId: null,
      transitionResults: [],
      piInfo: null
    }

    this.spacebar = false;

    this.onInputChange = this.onInputChange.bind(this);
    this.resetState = this.resetState.bind(this);
    this.searchForMonograph = this.searchForMonograph.bind(this);
    this.getPremiumMonograph = this.getPremiumMonograph.bind(this);
    this.isEmphasised = this.isEmphasised.bind(this);
    this.resetHeadingId = this.resetHeadingId.bind(this);
    this.getURLParam = this.getURLParam.bind(this);

    this.debounceSearch = Helpers.debounce(this.debounceSearch, 500);
  }

  toggleAlert() {
    this.state.alert ? this.setState({ alert : false }) : this.setState({ alert : true });
  }

  getURLParam(param){
    const _url = window.location.search.substring(1);
    const _variables = _url.split('&');
    for(let index of _variables){
      const _param = index.split('=');
      if(_param[0] === param) return _param[1];
    }
    return '';
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
    window.dataLayer && window.dataLayer.push({
      'event': 'premium-monograph-drug',
      'search-term': value,
      'event-type': 'search'
    });

    console.log('SEARCH', encodeURI(value.toLowerCase()));
    this.setState({ status : 'searching' });
    axios.get(this.props.searchUrl, {
      params: {
        drugId : this.props.searchId,
        searchTerm : encodeURI(value.toLowerCase())
      }
    })
    .then(response => {
      const _newResults = [ ...response.data.Results ];
      const _newTransitionResults = [ ...this.state.results ];
      const _prescribingInformation = (response.data.PrescribingInformationLink) ? [ response.data.PrescribingInformationLink ] : null;

      if(_newResults.length > 0) this.setState({ results : _newResults, monograph : null, status: 'success', alert: false, piInfo: _prescribingInformation });
      else this.setState({ results : [], monograph : null, status: 'searching', alert: true, headingId: null, piInfo: null});

      console.log(`[Got response from ${this.props.searchUrl} for drugId ${this.props.searchId} and searchTerm "${value}".]`, response);
      console.log('[PI Info]', _prescribingInformation);
    })
    .catch(error => {
      this.setState({ results : [], monograph : null, status : 'error', alert: true, headingId: null, piInfo: null });
      console.log(`[Error getting response from ${this.props.searchUrl}]`, error);
    });
  }

  searchForMonograph(char, value) {
    if(char === 13 && this.state.searchValue.length > 2){
			this.searchAPI(value);
    }
  }

  getPremiumMonograph(id, headingId, headingTitle, subHeadingTitle) {
    window.dataLayer && window.dataLayer.push({
      'event': 'premium-monograph-drug',
      'file-id': id,
      'heading-title': headingTitle,
      'sub-heading-title': subHeadingTitle,
      'event-type': 'click-header'
    });

    this.setState({ status : 'searching' });
		if(headingId) this.setState({ headingId });
    axios.get(this.props.monographUrl, {
      params: {
				drugId: this.props.searchId,
        searchTerm : encodeURI(this.state.searchValue.toLowerCase()),
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

  componentDidMount(){
    if(this.state.searchValue.length > 0) this.searchAPI(this.state.searchValue.toLowerCase());
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
          emphasisedClicked={this.isEmphasised}/>
      )
    });

    let _monograph = null;
    if(this.state.monograph) {
      _monograph = <Monograph
                    title={this.state.monograph[0].Title}
                    headings={this.state.monograph[0].Headings}
                    fileid={this.state.monograph[0].FileId}
                    disclaimer={this.state.monograph[0].Disclaimer}
										stateHeadingId={this.state.headingId}
										resetHeadingId={this.resetHeadingId} />;
    };

    const _open = this.state.alert ? classes.Visible : null;
    
    let _piInfo = null;
    if(this.state.piInfo){
      _piInfo = (
        <div className={classes.PIinfo}>
          <div>
            <PDFIcon symbolClass={classes.Icon} />
          </div>
          <div>
            <div className={classes.PItitle}>{this.state.piInfo[0].DrugName} <span className={classes.PItitleAlt}>({this.state.piInfo[0].AlternateDrugName})</span></div>
            <div className={classes.DownloadTxt}>Download Pdf</div>
          </div>
        </div>
      )
    }

    return(
      <div className={classes.Module}>
        <div className={classes.Search}>
          <h5 className={classes.SearchHeading}>Search Premium Monographs</h5>
          <p className={classes.SearchBlurb}>Have a product inquiry? Access comprehensive and accurate pharmaceutical Medical Information</p>
          <SearchInput
            search={this.searchForMonograph}
            reset={this.resetState}
            value={this.state.searchValue}
            inputChange={this.onInputChange}
            status={this.state.status}/>
        </div>
        { _piInfo }
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
