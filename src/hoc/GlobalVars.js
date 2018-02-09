/*const NOVO_NORDISK_SEARCH_URL = 'http://localhost/cda/drug/searchpremiumcontent?drugId=';*/
const NOVO_NORDISK_SEARCH_URL = 'http://localhost/cda/drug/searchpremiumcontent';
const NOVO_NORDISK_MONOGRAPH_URL = 'http://localhost/cda/hminobot/drug/getpremiumcontentfile'
const NOVO_NORDISK_DRUGID = '34438';

const getGlobalUrl = () => {
  return NOVO_NORDISK_SEARCH_URL;
}

const getGlobalMonoUrl = () => {
  return NOVO_NORDISK_MONOGRAPH_URL;
}

const getGlobalDrugId = () => {
  return NOVO_NORDISK_DRUGID;
}

export default {
  getGlobalUrl,
  getGlobalMonoUrl,
  getGlobalDrugId
}
