/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import Game, {GameSchema} from './game.model';
import Player from '../player/player.model';

export function register(socket) {

  socket.on('game:join', join)
  socket.on('game:create', create)
  socket.on('game:changeName', changeName)
  socket.on('game:getupdate', getUpdate)
  socket.on('game:start', start)
  socket.on('game:missionPropose', missionPropose)
  socket.on('game:missionVote', missionVote)
  socket.on('game:missionGo', missionGo)
  socket.on('game:leave', leave)
  socket.on('game:replay', replay)
  socket.on('disconnect', disconnect)

  function getUpdate(gameID) {
    Game.findById(gameID).exec()
    .then(game => {
      if (game) {
        _linkRoom(game)
        socket.emit('game:update', game)
      }
    })
  }

  function join(gameID, obs, cb) {
    Game.findById(gameID).exec()
    .then(game => {
      if (!socket.currPlayerID) return
      if (game !== null && game.status === 1) {
        cb(true)
        _joinGame(game, obs)
      }
      else {
        cb(false)
      }
    })
  }

  function create(obs) {
    let symbols = 'abcdefghijkmnopqrstuvwxyz234567890'
    let gameID = ""
    for (let i=0; i<5; i++) {
      gameID =  gameID + symbols[Math.floor(Math.random() * 34)]
    }
    Game.create({_id : gameID})
    .then(game => {
      if (!socket.currPlayerID) return
      console.log('created a game: ', game._id)
      _joinGame(game, obs)
    })
  }

  function changeName(name) {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game) {
        if (!socket.currPlayerID) return
        game.nameHash[socket.currPlayerID] = name
        game.markModified('nameHash')
        game.saveEmit(socket)
      }
    })
  }

  function start() {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      Player.findById(socket.currPlayerID).exec()
      .then(player => {
        if (game.players[0] === socket.currPlayerID && game.started === false && game.players.length > 4) {
          game.start()
          game.saveEmit(socket)
        }
      })
    })
  }

  function replay() {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      Player.findById(socket.currPlayerID).exec()
      .then(player => {
        if (game.players[0] === socket.currPlayerID && game.status > 4) {
          game.status = 1
          game.started = false
          game.numSpy = 0
          game.spyList = []
          game.roles = []
          game.currRound = 0
          game.rounds = []
          game.saveEmit(socket)
        }
      })
    })
  }

  function _linkRoom(game) {
  // associates this socket connection with the room
  // note that we are saving model id's into the socket object
    console.log('joined game')
    socket.join(game._id)
    socket.currGameID = game._id
  }

  function _unlinkRoom(game) {
  // unassociates this socket connection with the room
    socket.leave(game._id)
    socket.currGameID = null
  }

  function _joinGame(game, obs) {
    _linkRoom(game)

    if (!obs && game.players.indexOf(socket.currPlayerID) === -1) {
      game.players.push(socket.currPlayerID)
      let playerNum = Math.floor(Math.random() * 9999)
      game.nameHash[socket.currPlayerID] = 'player' + ("0000" + playerNum).substr(-4,4);
      game.markModified('nameHash')
      game.saveEmit(socket)
    }

    Player.findById(socket.currPlayerID).exec()
    .then(player => {
      player.gameID = game._id
      player.saveEmit(socket)
    })
  }

  function disconnect() {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game && game.status === 1)
        leave()
    })
  }

  function leave() {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game && game.status === 1 || game.status > 4 ) {
        Player.findById(socket.currPlayerID).exec()
        .then(player => {
          game.players.remove(socket.currPlayerID)
          delete game.nameHash[socket.currPlayerID]
          game.markModified('nameHash')
          player.gameID = null;
          _unlinkRoom(game)
          game.saveEmit(socket)
          player.saveEmit(socket) // this must come before game.saveEmit in order for duplicate players to be notified properly
          console.log('player left:', player._id)
        })
      }
    })
  }

  function missionPropose(participants) {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game) {
        game.proposeMission(participants)
        game.saveEmit(socket)
      }
    })
  }

  function missionVote(vote) {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game) {
        var playerIndex = game.players.indexOf(socket.currPlayerID)
        game.voteMission(vote, playerIndex)
        game.saveEmit(socket)
      }
    })
  }

  function missionGo(passFail) {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game) {
        var playerIndex = game.players.indexOf(socket.currPlayerID)
        game.goMission(passFail, playerIndex)
        game.saveEmit(socket)
      }
    })
  }
}
