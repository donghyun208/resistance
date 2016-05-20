/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import Player, {PlayerSchema} from './player.model';
import Game, {GameSchema} from '../game/game.model';
import Promise from 'bluebird';



export function register(socket) {

  socket.on('player:load', load)

  function updatePlayer(player) {
    socket.currPlayerID = player._id
    console.log('updating player', player)
    socket.emit('player:update', player)
  }

  function load(playerID, cb) {
    new Promise(function(resolve, reject){
      Player.findById(playerID).exec()
      .then(player => {
        if (player) {
          resolve(player)
          if (player.gameID) {
            Game.findById(player.gameID).exec()
            .then(game => {
              socket.join(game._id)
            })
          }
        }
        else {
          Player.create('')
          .then(player => { resolve(player) })
        }
      })
    })
    .then(player => {
      socket.join(player._id)
      updatePlayer(player)
      cb(player)
    })
  }

  function setName(newName) {
    Player.findById(socket.currPlayerID).exec()
    .then(player => {
      if (player) {
        player.name = newName
        Game.findById(socket.currGameID).exec()
        .then(game => {
          if (game) {
            game.nameHash[player._id] = newName
            game.save(socket)
          }
        })
      }
    })
  }
}
