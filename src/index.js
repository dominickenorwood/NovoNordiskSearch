import React from 'react';
import ReactDOM from 'react-dom';
import GlobalVars from './hoc/GlobalVars';
import './index.css';
import App from './App';

ReactDOM.render(<App appUrl={GlobalVars.getGlobalUrl()} monoUrl={GlobalVars.getGlobalMonoUrl()} drugId={GlobalVars.getGlobalDrugId()} />, document.getElementById('NovoNordiskSearch__Root'));
