import * as types from './mutation-types';
const mutations = {
  [types.SET_POSITION](state, position) {
    state.position = position;
  },
  [types.SET_WINDOWMESSAGE](state, windowMessage) {
    state.windowMessage = windowMessage;
  },
  [types.SET_BIKETYPE](state, bikeType) {
    state.bikeType = bikeType;
  },
  [types.SET_BEGINPOSITION](state, beginPosition) {
    state.beginPosition = beginPosition;
  },
  [types.SET_FINISHPOSITION](state, finishPosition) {
    state.finishPosition = finishPosition;
  },
  [types.SET_ROUTERNAME](state, routerName) {
    state.routerName = routerName;
  }
};

export default mutations;
