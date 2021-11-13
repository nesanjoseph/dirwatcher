const cron = require('node-cron');
const folderWatch = require('./folder-watch');

(async()=> {
  let watcherInfo = await folderWatch.getWatcherInfo();
  if(!watcherInfo) {
    global.task = cron.schedule('* * * * * *', () =>  {
      console.log('Waiting for watch instructions...');
    }, {
      scheduled: true
    });
    
    global.task.start();
  } else {
    global.folderToWatch = watcherInfo.folder;
    global.magicword = watcherInfo.magicword;
    global.task = cron.schedule(watcherInfo.cron, () =>  {
      folderWatch.watchFolder(global.folderToWatch, global.magicword);
    }, {
      scheduled: true
    });
    
    global.task.start();
  }
})();

const stopCron = () => {
  try  {
    global.task.stop();
  } catch(e) {
    throw "Watcher already is in idle state";
  }
}
const startCron = () => {
  try  {
    global.task.start();
  } catch(e) {
    throw "Watcher already running";
  }
}

const updateCron = (folder, cronString, magicword) => {
  try {
    global.task.stop();
    delete global.task;
  } catch(err) {
    console.error({err});
  }
  global.folderToWatch = folder;
  global.magicword = magicword;
  global.task = cron.schedule(cronString, () =>  {
    folderWatch.watchFolder(global.folderToWatch, global.magicword);
  }, {
    scheduled: true
  });
  
  global.task.start();
}

module.exports = {
  stopCron,
  startCron,
  updateCron
}