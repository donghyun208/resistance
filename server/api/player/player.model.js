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


PlayerSchema.methods.saveEmit =  function(socket) {
  socket.currPlayerID = this._id
  console.log('emitting to player ', this._id)
  socket.emit('player:update', this)
  socket.broadcast.to(this._id).emit('player:update', this)
  this.save()
}

export default mongoose.model('Player', PlayerSchema);
