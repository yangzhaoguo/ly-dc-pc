import * as types from './mutation-types';

export const actionBikeType = function({commit}, {bikeType}) {
  commit(types.SET_BIKETYPE, bikeType);
};
