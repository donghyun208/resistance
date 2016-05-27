/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import Player, {PlayerSchema} from './player.model';
import Game, {GameSchema} from '../game/game.model';
import Promise from 'bluebird';



export function register(socket) {

  socket.on('player:load', load)

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
              socket.currGameID = game._id
              socket.emit('game:update', game)
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
      console.log('player joined socket', player._id)
      socket.join(player._id)
      player.saveEmit(socket)
      cb(player)
    })
  }

  // function setName(newName) {
  //   Player.findById(socket.currPlayerID).exec()
  //   .then(player => {
  //     if (player) {
  //       player.name = newName
  //       Game.findById(socket.currGameID).exec()
  //       .then(game => {
  //         if (game) {
  //           game.nameHash[player._id] = newName
  //           console.log(game._id, player._id, newName)
  //           game.save(socket)
  //         }
  //       })
  //     }
  //   })
  // }
}
