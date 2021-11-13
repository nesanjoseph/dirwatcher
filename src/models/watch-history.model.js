const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const watchHistorySchema = mongoose.Schema(
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
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    time_taken_in_ms: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: false
    },
    new_files: {
      type: [String],
      required: false
    },
    deleted_files: {
      type: [String],
      required: false
    },
    all_files: {
      type: [String],
      required: false
    }
  },
  {
    timestamps: true,
  }
);

watchHistorySchema.plugin(toJSON);

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

module.exports = WatchHistory;
