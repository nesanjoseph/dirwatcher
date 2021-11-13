const { Watcher, WatchHistory } = require('../models');
const glob = require("glob");
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const lineByLine = require('n-readlines');

const getDirectories = (folder) => {
  return new Promise((resolve, reject) => {
    glob(folder + '/**/*', (err, res) => {
      if (err) {
        console.error({ err });
        reject(err)
      } else {
        resolve(res);
      }
    });
  });
}

async function countWord(filePath, magicWord) {
  let wordCount = 0;
  let liner = new lineByLine(filePath);

  while (line = liner.next()) {
    let lineString = line.toString();
    let searchThis = magicWord;
    let re = new RegExp(searchThis, 'g');
    var count = (lineString.match(re) || []).length;
    wordCount += count;
  }
  return wordCount;
}

const readFiles = async (folder, magicWord, prevAllFiles) => {
  let fileToWordCount = {}, totalCount = 0;
  let newFiles = [], deletedFiles = [];
  try {
    let allFiles = await getDirectories(folder);
    prevAllFiles.sort();
    allFiles.sort();
    deletedFiles = _.difference(prevAllFiles, allFiles);
    newFiles = _.difference(allFiles, prevAllFiles);
    for (let i = 0; i < allFiles.length; i++) {
      let stats = fs.statSync(allFiles[i]);
      if (stats.isFile()) {
        let wordCount = await countWord(allFiles[i], magicWord);
        fileToWordCount[allFiles[i]] = wordCount;
        totalCount += wordCount;
      }
    }

    return {
      currentAllFiles: allFiles,
      newFiles,
      deletedFiles,
      totalCount
    }
  } catch (e) {
    console.error({ e });
  }
}

const getWatcherInfo = async (email) => {
  return Watcher.findOne({});
};

const getLastRunWatcherInfo = async (folder) => {
  return await WatchHistory.findOne({ folder }, null, { sort: { "createdAt": "-1" } });
}

const insertWatcherInfo = async (toInsert) => {
  return await WatchHistory.create(toInsert)
}

const watchFolder = async (folder, magicWord) => {
  if (global.folderWatchRunning === true) {
    console.log("Folder scan running.... Skipping the new scan attempt...")
    return;
  }
  global.folderWatchRunning = true;
  let runResult = {};
  let status = "success", error = "";
  let startTime = moment();
  try {
    console.log("\n----------------------------------------------------")
    console.log(`Started scanning directory "${folder}" for magicword "${magicWord}"`);
    let lastRunInfo = await getLastRunWatcherInfo(folder);
    let prevAllFiles = lastRunInfo ? lastRunInfo.all_files : [];
    runResult = await readFiles(folder, magicWord, prevAllFiles);
    console.log("Completed scanning directory!");
  } catch (e) {
    console.log("@@@@@ Error while scanning directory @@@@@");
    status = "failed";
    error = e.toString();
    console.error({ e });
  }
  let endTime = moment();

  try {
    let timetaken = endTime - startTime;

    let toInsert = {
      folder,
      magicword: magicWord,
      start_time: startTime,
      end_time: endTime,
      time_taken_in_ms: timetaken,
      count: _.get(runResult, 'totalCount', 0),
      status,
      error,
      all_files: _.get(runResult, 'currentAllFiles', []),
      new_files: _.get(runResult, 'newFiles', []),
      deleted_files: _.get(runResult, 'deletedFiles', [])
    };

    await insertWatcherInfo(toInsert);
    console.log("Watcher history inserted successfully")
    console.log("Time taken in milliseconds: ", timetaken);
  } catch (err) {
    console.error({ err });
  }
  console.log("----------------------------------------------------")

  global.folderWatchRunning = false;
}

module.exports = {
  getWatcherInfo,
  watchFolder
}
