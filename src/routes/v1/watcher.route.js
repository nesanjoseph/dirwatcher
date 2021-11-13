const express = require('express');
const watcherController = require('../../controllers/watcher.controller');

const router = express.Router();

router
  .get('/watcher/status', watcherController.getWatcherStatus)
  .get('/watcher/history', watcherController.getWatcherHistory)
  .post('/watcher/update', watcherController.updateWatcher)
  .post('/watcher/start', watcherController.startWatcher)
  .post('/watcher/stop', watcherController.stopWatcher);

module.exports = router;
