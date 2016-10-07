'use strict'

const VIEWSTATE = require('./viewstate')

module.exports = {
  MOBILE: {
    url: 'http://nextride.brampton.ca/mob/SearchBy.aspx',
    payload: {
      __VIEWSTATE: VIEWSTATE.mobile
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
  },
  DESKTOP: {
    url: 'http://nextride.brampton.ca/RealTime.aspx',
    payload: {
      __VIEWSTATE: VIEWSTATE.desktop
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
}
