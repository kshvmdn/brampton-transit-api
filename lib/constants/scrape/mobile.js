module.exports = exports = {
  url: 'http://nextride.brampton.ca/mob/SearchBy.aspx',
  payload: {
    __VIEWSTATE: require('./viewstate').mobile
  },
  elements: {
    form: {
      stop_input: 'ctl00$mainPanel$searchbyStop$txtStop',
      submit_button: 'ctl00$mainPanel$btnGetRealtimeSchedule'
    },
    dom: {
      description: 'ctl00_mainPanel_lblStopDescription',
      results: 'ctl00_mainPanel_gvSearchResult',
      error: 'ctl00_mainPanel_lblError',
      stop_select: 'ctl00_mainPanel_searchbyStop_ddlStopList'
    }
  }
}
