const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { watcherService } = require('../services');
const _ = require('lodash');
const fs = require('fs');

const updateWatcher = catchAsync(async (req, res) => {
  if (_.trim(_.get(req.body, 'folder')) == "" || _.trim(_.get(req.body, 'cron')) == "" || _.trim(_.get(req.body, 'magicword')) == "") {
    return res.status(httpStatus.BAD_REQUEST).send("folder, cron &  magicword must be a valid string");
  }

  try {
    if (!fs.lstatSync(_.trim(_.get(req.body, 'folder'))).isDirectory()) {
      return res.status(httpStatus.BAD_REQUEST).send("folder does not exist");
    }
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).send("folder does not exist");
  }

  try {
    const watcher = await watcherService.updateWatcher(req.body);
    res.status(httpStatus.OK).send(watcher);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
});

const getWatcherStatus = catchAsync(async (req, res) => {
  try {
    const watcherStatus = await watcherService.getWatcherStatus();
    res.status(httpStatus.OK).send(watcherStatus);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
});

const startWatcher = catchAsync(async (req, res) => {
  try {
    const result = await watcherService.startWatcher();
    res.status(httpStatus.OK).send(result);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
});

const stopWatcher = catchAsync(async (req, res) => {
  try {
    const result = await watcherService.stopWatcher();
    res.status(httpStatus.OK).send(result);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
});

const getWatcherHistory = catchAsync(async (req, res) => {
  try {
    const result = await watcherService.getWatcherHistory();
    res.status(httpStatus.OK).send(result);
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
});

module.exports = {
  updateWatcher,
  getWatcherStatus,
  startWatcher,
  stopWatcher,
  getWatcherHistory
};
