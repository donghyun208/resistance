'use strict';

import mongoose from 'mongoose';
import shortid from 'shortid';
import Game from '../game/game.model'

export var PlayerSchema = new mongoose.Schema({
  _id:  {
          type:     String,
          'default': shortid.generate
        },
  name: String,
  info: String,
  active: Boolean,
  gameID: {type: String, ref: 'Game'}
  },
  {versionKey: false}
);

export default mongoose.model('Player', PlayerSchema);
