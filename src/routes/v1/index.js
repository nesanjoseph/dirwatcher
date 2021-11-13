const express = require('express');
const watcherRoute = require('./watcher.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: watcherRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
