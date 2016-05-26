'use strict';

import mongoose from 'mongoose';
import Player from '../player/player.model'

var RoundSchema = new mongoose.Schema({
  _id:          false,
  participants: [Number], // the players who went on the mission
  fail:         Number, // number of fails required
  result:       {type: Number, default: 0}, // pass (1) or fail (2) (-1 if autofailed)
  leaderStart:  Number,  // the person who started as leader this round
  attempt:      {type: Number, default: 0}, // number of missions proposed (after 4, autofail)
  votes:        [Number],
  passfails:    [Number]
})

// passFail (1 is pass mission, 2 is fail mission)

// Round.result
// 0 by default
// 1 if pass   (possible to get 1.1 if there is 1 fail on round 4)
// -1 if failed
// -2 if failed automatically
// Round.result x.1 if 1 fail
// Round.result x.2 if 2 fails
// Round.result x.3 if 3 fails

export var GameSchema = new mongoose.Schema({
  _id:  {
          type:     String,
          'default': generateID
        },
  players:      [{type: String, ref: 'Player'}],
  nameHash:     {type: mongoose.Schema.Types.Mixed, default: {}},
  status:       {type: Number, default: 1},
  started:      {type: Boolean, default: false},
  numSpy:       {type: Number, default: 0},
  spyList:      [Number],
  roles:        [Number],
  currRound:    {type: Number, default: 0},
  rounds:       [RoundSchema]
  },
  {versionKey: false}
);
// status:
// 1 - lobby (game has not started)
// 2 - mission leader is choosing team
// 3 - group is voting on the team
// 4 - team is going on the mission
// 5 - game is over, resistance win
// 6 - game is over, spies win

var generateID = function() {
    console.log('try to generate')
    let symbols = 'abcdefghijkmnopqrstuvwxyz234567890'
    gameID = ''
    for (let i=0; i++; i<5) {
      gameID += symbols[Math.floor(Math.random() * 34)]
    }
    console.log(gameID)
    return gameID
  }

GameSchema.methods.saveEmit =  function(socket) {
    // call this if game model has been changed
    console.log('game saved')
    if (socket.currGameID == this._id) {
      socket.emit('game:update', this)
    }
    socket.broadcast.to(this._id).emit('game:update', this)
    this.save()
  }


GameSchema.methods.start = function() {
  // this.populate('playerList', 'username -_id', function(err, game) {
  //   cb(game)
  // })
  // cb(game)
  var numPlayers = this.players.length
  var missionReq;

  if (numPlayers <= 5) {
    this.numSpy = 2
    missionReq = [2, 3, 2, 3, 3]
  }
  else if (numPlayers == 6) {
    this.numSpy = 2
    missionReq = [2, 3, 4, 3, 4]
  }
  else if (numPlayers == 7) {
    this.numSpy = 3
    missionReq = [2, 3, 3, 4, 4]
  }
  else if (numPlayers == 8 || numPlayers == 9 ) {
    this.numSpy = 3
    missionReq = [3, 4, 4, 5, 5]
  }
  else if (numPlayers > 9) {
    this.numSpy = 4
    missionReq = [3, 4, 4, 5, 5]
  }

  if (numPlayers >= 7)
    var failNum = 2
  else
    var failNum = 1


  var emptyVotesArr = new Array(numPlayers).fill(0);
  console.log('empty votes arr', emptyVotesArr)
  for (let missionSize of missionReq) {
    var emptyPassFailsArr = new Array(missionSize).fill(0);
    this.rounds.push({fail: failNum, votes: emptyVotesArr, passfails: emptyPassFailsArr})
  }

  //randomize the first mission leader
  this.rounds[0].leaderStart = Math.floor(Math.random() * this.players.length);

  var roleList = []

  for (var i=0; i<this.numSpy; i++) {
    roleList.push(2)
  }
  while (roleList.length < numPlayers) {
    roleList.push(1)
  }
  this.roles = shuffle(roleList)
  this.started = true
  this.status = 2
}


GameSchema.methods.proposeMission = function(participants) {
  if (this.status === 2) {
    let round = this.rounds[this.currRound]
    if (round.passfails.length === participants.length) {
      round.participants = participants
      round.votes.fill(0)
      this.markModified('rounds')
      this.status = 3
    }
  }
}

GameSchema.methods.voteMission = function(vote, playerIndex) {
  if (this.status === 3) {
    let round = this.rounds[this.currRound]
    round.votes[playerIndex] = vote
    let allFinished = true
    console.log('this vote is ', round.votes)
    for (let j of round.votes) {
      console.log(j, allFinished)
      if (j === 0)
        allFinished = false
    }
    if (allFinished) {
      this.processVotes(round)
    }
    this.markModified('rounds')
  }
}

GameSchema.methods.processVotes = function(round) {
  console.log('************PROCESSING VOTES ************')
  let tot = 0;
  for (let j of round.votes) {
    if (j === 2) {
      tot += 2;
    }
  }
  if (tot > round.votes.length) {
    this.missionSend(round)
  }
  else {
    this.nextLeader(round)
  }
}

GameSchema.methods.nextLeader = function(round) {
  round.attempt += 1;
  if (round.attempt == 5) {
    this.autoFail(round)
  }
  else {
    this.status = 2;
  }
  this.markModified('rounds')
}

GameSchema.methods.missionSend = function(round) {
  this.status = 4
}

GameSchema.methods.goMission = function(passFail, playerIndex) {
  // passFail (1 is pass mission, 2 is fail mission)
  if (this.status === 4) {
    let round = this.rounds[this.currRound]
    let participantIndex = round.participants.indexOf(playerIndex)
    round.passfails[participantIndex] = passFail
    let allFinished = true
    console.log('this passfails is ', round.passfails)
    for (let j of round.passfails) {
      console.log(j, allFinished)
      if (j === 0)
        allFinished = false
    }
    if (allFinished) {
      this.processMission(round)
      this.advanceRound()
    }
    this.markModified('rounds')
  }
}

GameSchema.methods.processMission = function(round) {
  console.log('************PROCESSING MISSON ************')
  round.passfails = shuffle(round.passfails)
  let tot_fails = 0;
  for (let j of round.passfails) {
    if (j === 2) {
      tot_fails += 1;
    }
  }
  round.result = 1 + tot_fails / 10.0
  console.log(tot_fails, round.fail, round.fail >= tot_fails)
  if (round.fail <= tot_fails)
    round.result *= -1
}

GameSchema.methods.autoFail = function(round) {
  round.result = -1
  this.advanceRound()
}

GameSchema.methods.resistanceWin = function() {
  this.status = 5
}

GameSchema.methods.spyWin = function() {
  this.status = 6
}

GameSchema.methods.nextRound = function() {
  this.status = 2
  let prevLeader = this.rounds[this.currRound].leaderStart + this.rounds[this.currRound].attempt
  this.currRound += 1
  this.rounds[this.currRound].leaderStart = (prevLeader + 1) % this.players.length
}

GameSchema.methods.advanceRound = function() {
  // checks if the game has ended. if not, advances the round
  let numFail = 0
  let numPass = 0
  for (let round of this.rounds) {
    if (round.result > 0) {
      numPass += 1
    }
    else if (round.result < 0) {
      numFail += 1
    }
  }
  if (numPass === 3) {
    this.resistanceWin()
  }
  else if (numFail === 3) {
    this.spyWin()
  }
  else {
    this.nextRound()
  }
}

function shuffle(origArray) {
  var currentIndex = origArray.length, temporaryValue, randomIndex;
  var array = origArray.slice(0);

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export default mongoose.model('Game', GameSchema);
