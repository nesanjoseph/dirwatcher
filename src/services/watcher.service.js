const _ = require('lodash');
const { Watcher, WatchHistory } = require('../models');

const cron = require('../cron/cron');

const updateWatcher = async (payload) => {

  let watcherData, toRet;
  try {
    watcherData = await Watcher.findOne({});
    if(!watcherData) {
      toRet = await Watcher.create(payload);
    } else {
      toRet = await Watcher.findByIdAndUpdate(watcherData._id, _.pick(payload, ["folder", "cron", "magicword"]), {overwrite : true, returnDocument : 'after', new: true})
    }
  
    cron.updateCron(payload.folder, payload.cron, payload.magicword);
    return toRet;
  } catch(e) {
    console.log({e});
    throw e;
  }
};

const getWatcherStatus = async (payload) => {

  try {
    if(global.folderWatchRunning === true) {
      return {status : "running"};
    } else {
      return {status : "idle"};
    }
  } catch(e) {
    console.error({e});
    throw e;
  }
};

const startWatcher = async () => {
  try {
    cron.startCron();
    return "Started successfully";
  } catch(e) {
    console.error({e});
    throw e;
  }
};

const stopWatcher = async () => {
  try {
    cron.stopCron();
    return "Stopped successfully";
  } catch(e) {
    console.error({e});
    throw e;
  }
};

const getWatcherHistory = async () => {

  let watcherHistory, toRet;
  try {
    watcherHistory = await WatchHistory.find({}).sort({"createdAt" : -1}).limit(100);
    return watcherHistory;
  } catch(e) {
    console.log({e});
    throw e;
  }
};

module.exports = {
  updateWatcher,
  getWatcherStatus,
  startWatcher,
  stopWatcher,
  getWatcherHistory
};
