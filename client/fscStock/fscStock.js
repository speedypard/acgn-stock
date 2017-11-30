'use strict';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { inheritedShowLoadingOnSubscribing } from '../layout/loading';
import { shouldStopSubscribe } from '../utils/idle';
import { dbDirectors } from '/db/dbDirectors';

export const ownStocksOffset = new ReactiveVar(0);
inheritedShowLoadingOnSubscribing(Template.fscStock);
Template.fscStock.onCreated(function() {
  ownStocksOffset.set(0);
  this.autorun(() => {
    if (shouldStopSubscribe()) {
      return false;
    }
    const userId = '!FSC';
    this.subscribe('accountOwnStocks', userId, ownStocksOffset.get());
  });
});
Template.fscStock.helpers({
  stockList() {
    const userId = '!FSC';

    return dbDirectors.find({userId}, {
      limit: 20
    });
  },
  paginationData() {
    return {
      useVariableForTotalCount: 'totalCountOfAccountOwnStocks',
      dataNumberPerPage: 20,
      offset: ownStocksOffset
    };
  }
});