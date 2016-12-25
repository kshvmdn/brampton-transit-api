module.exports = exports = {
  url: 'http://nextride.brampton.ca/RealTime.aspx',
  payload: {
    __VIEWSTATE: require('./viewstate').desktop
  },
  elements: {
    form: {
      event_target: '__EVENTTARGET',
      event_argument: '__EVENTARGUMENT'
    },
    dom: {
      routes: {
        name: 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownRoute',
        id: 'ctl00_mainPanel_MainPanel1_SearchStop1_DropDownRoute'
      },
      stops: {
        name: 'ctl00$mainPanel$MainPanel1$SearchStop1$DropDownStop',
        id: 'ctl00_mainPanel_MainPanel1_SearchStop1_DropDownStop'
      }
    }
  }
}
