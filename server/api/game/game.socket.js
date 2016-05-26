/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import Game, {GameSchema} from './game.model';
import Player from '../player/player.model';

export function register(socket) {

  socket.on('game:join', join)
  socket.on('game:joinObs', joinObs)
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

  // GameSchema.post('save', function(game) {
  //   console.log('this gets printed at game save');
  //   // socket.emit('game:update', game)
  //   socket.broadcast.to(game._id).emit('game:update', game)
  // })

  function getUpdate(gameID) {
    Game.findById(gameID).exec()
    .then(game => {
      if (game) {
        _linkRoom(game)
        socket.emit('game:update', game)
      }
    })
  }

  function create() {
    console.log('try to create game')

    let symbols = 'abcdefghijkmnopqrstuvwxyz234567890'
    let gameID = ""
    for (let i=0; i<5; i++) {
      gameID =  gameID + symbols[Math.floor(Math.random() * 34)]
    }
    console.log(gameID)
    Game.create({_id : gameID})
    .then(game => {
      console.log('created a game: ', game)
      _joinGame(game)
    })
  }

  function changeName(name) {
    Game.findById(socket.currGameID).exec()
    .then(game => {
      if (game) {
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
    console.log('joined')
    socket.join(game._id)
    socket.currGameID = game._id
  }

  function _unlinkRoom(game) {
  // unassociates this socket connection with the room
    console.log('left')
    socket.leave(game._id)
    socket.currGameID = null
  }

  function _joinGame(game) {
    console.log('rejoining game')
    _linkRoom(game)
    game.players.push(socket.currPlayerID)
    let playerNum = Math.floor(Math.random() * 9999)
    game.nameHash[socket.currPlayerID] = 'player' + ("0000" + playerNum).substr(-4,4);
    game.markModified('nameHash')

    game.saveEmit(socket)
    Player.findById(socket.currPlayerID).exec()
    .then(player => {
      player.gameID = game._id
      player.save()
      .then(player => {
        console.log('player:update', player._id)
        socket.emit('player:update', player)
      })
    })
  }

  function _joinObsGame(game) {
    console.log('rejoining game')
    _linkRoom(game)
    Player.findById(socket.currPlayerID).exec()
    .then(player => {
      player.gameID = game._id
      player.save()
      .then(player => {
        console.log('player:update', player._id)
        socket.emit('player:update', player)
      })
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
    console.log('trying to leave', socket.currGameID)
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
          player.save()
          .then(player => {
            console.log('player:update', player._id)
            socket.emit('player:update', player)
          })
          if (game.players.length === 0){
            game.save()
            //********* delete this game *********
          }
          else {
            game.saveEmit(socket)
          }
        })
      }
    })
  }

  function join(gameID, cb) {
    Game.findById(gameID).exec()
    .then(game => {
      console.log('try joining ', game)
      if (game !== null && game.status === 1) {
        cb(true)
        _joinGame(game)
      }
      else {
        cb(false)
      }
    })
  }

  function joinObs(gameID, cb) {
    // join as obsever
    Game.findById(gameID).exec()
    .then(game => {
      console.log('try joining ', game)
      if (game !== null && game.status === 1) {
        cb(true)
        _joinObsGame(game)
      }
      else {
        cb(false)
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
