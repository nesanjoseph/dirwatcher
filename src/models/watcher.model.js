const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const cronValidator = require('cron-validator');

const watcherSchema = mongoose.Schema(
  {
    folder: {
      type: String,
      required: true,
      trim: true,
    },
    magicword: {
      type: String,
      required: true,
      trim: true,
    },
    cron: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!cronValidator.isValidCron(value)) {
          throw new Error('Not a valid cron pattern');
        }
      },
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
watcherSchema.plugin(toJSON);

/**
 * @typedef Watcher
 */
const Watcher = mongoose.model('Watcher', watcherSchema);

module.exports = Watcher;
