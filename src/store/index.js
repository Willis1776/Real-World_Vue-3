import { createStore } from 'vuex'
import EventService from '@/services/EventService.js'

export default createStore({
  state: {
    user: 'Michael Willis',
    events: [],
    totalEvents: 0
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event)
    },
    SET_EVENTS(state, events, totalEvents) {
      state.events = events
      state.totalEvents = totalEvents
    }
  },
  actions: {
    createEvent({ commit }, event) {
      EventService.postEvent(event)
        .then(() => {
          commit('ADD_EVENT', event)
        })
        .catch(error => {
          console.log(error)
        })
    },
    fetchEvents({ commit }, { routeTo, next }) {
      return EventService.getEvents(2, parseInt(routeTo.query.page) || 1)
        .then(response => {
          next(
            commit(
              'SET_EVENTS',
              response.data,
              response.headers['x-total-count']
            )
          )
        })
        .catch(() => {
          next({ name: 'NetworkError' })
        })
    }
    // fetchEvents({ commit }) {
    //   EventService.getEvents()
    //     .then(response => {
    //       commit('SET_EVENTS', response.data)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // }
  },
  modules: {}
})
