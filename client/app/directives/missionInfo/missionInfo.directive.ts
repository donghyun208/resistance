'use strict';
(function(){

class MissionInfoCtrl {
  private svg
  private cartScaleX: number
  private cartScaleY: number
  private rounds

  constructor (private $rootScope, private Game) {

    let plotHeight = 80,
        plotWidth = 340
    this.circleRadius = 20
    this.currCircleRadius = 30
    this.smallCircleRadius = 3
    this.Game = Game
    // this.bgColor = "#778899"
    this.bgColor = "white"
    this.roundColor = '#DCDCDC'
    this.smallColor = '#D3D3D3'
    this.passSmallColor = '#00008B'
    this.passColor = '#6495ED'
    this.failSmallColor = '#800000'
    this.failColor = '#CD5C5C'
    this.waitSmallColor = '#696969'

    this.svg = d3.select('svg')
      .attr("viewBox", "0 0 " + plotWidth + " " + plotHeight)
      .attr('width', '100%')
      .attr('height', '100%')

    this.indexX = d3.scale.linear()
                    .domain([0,4])
                    .range([40, 300]);
    this.indexY = d3.scale.linear()
                    .domain([0,4])
                    .range([40, 40]);

    this.pentagon = [[ 0.0,     -1.0],
                     [ 0.95106, -0.30902],
                     [ 0.58779,  0.80902],
                     [-0.58779,  0.80902],
                     [-0.95106, -0.30902]]
    this.passfailsCircle = {
      2: [[-0.21644, 0.9763], [0.21644, 0.9763]],
      3: [[-0.42262, 0.90631], [0.0, 1.0], [0.42262, 0.90631]],
      4: [[-0.60876, 0.79335], [-0.21644, 0.9763], [0.21644, 0.9763], [0.60876, 0.79335]],
      5: [[-0.76604, 0.64279], [-0.42262, 0.90631], [0.0, 1.0], [0.42262, 0.90631], [0.76604, 0.64279]],
    }



    this.render()
    this.rerender()

    this.$rootScope.$on('game:updated', () => {
      // this.$timeout(() => {
      // }, 1)
      this.rerender()
    })

  }


  render() {
    var _this = this
    this.rounds = this.svg.selectAll('g.rounds')
      .data(this.Game.model.rounds).enter()
      .append('g')
      .attr('class', 'rounds')
      .attr('transform', (data, index) => {
        return "translate(" + this.indexX(index) + "," + this.indexY(index) + ")"
      })

    this.rounds
      .append('circle')
      .attr('class', 'round')
      .attr('r', (data, index) => {
        return this.circleRadius
      })
      .style('fill', this.roundColor)
      .style('stroke', 'black')
      .style('stroke-width', .5)

    // Current round circle ****************
    this.currG = this.rounds
      .append('g')
      .attr('class', 'curr')
      .attr('opacity', 0)

    this.currG
      .append('circle')
      .attr('r', (data, index) => {
        return this.currCircleRadius
      })
      .style('fill', 'none')
      .style('stroke', 'black')

    this.currG
      .each(function(data, index) {
        let curr = d3.select(this)
        for (let coords of _this.pentagon) {
          curr
          .append('circle')
          .attr('class', 'attempt')
          .attr('cx', coords[0] * _this.currCircleRadius)
          .attr('cy', coords[1] * _this.currCircleRadius)
          .attr('r', _this.smallCircleRadius)
          .style('fill', _this.bgColor)
          .style('stroke', 'black')
        }
      })
    // **********************************

    this.rounds
      .append('text')
      .attr('class', 'text')
      .text((data, index) => {
        if (data.fail > 1)
          return data.passfails.length + '*'
        else
          return data.passfails.length
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')


    this.rounds
      .each(function(data, index) {
        let round = d3.select(this)
        let numCircles = data.passfails.length
        for (let coords of _this.passfailsCircle[numCircles]) {
          round
          .append('circle')
          .attr('class', 'passfail')
          .attr('cx', coords[0] * _this.circleRadius)
          .attr('cy', coords[1] * _this.circleRadius)
          .attr('r', _this.smallCircleRadius)
          .attr('stroke-width', .5)
          .style('stroke', 'black')
          .style('fill', _this.smallColor)
        }
      })

    let t0 = Date.now();
    d3.timer(() => {
      let delta = (Date.now() - t0)
      this.currG
      .attr("transform", function(d) {
        return "rotate(" + delta * 1/90 + ")"
      })
    })

  }

  rerender() {
    var _this = this
    this.svg.selectAll('g.rounds')
      .each(function(roundData, index) {
        let roundData = _this.Game.model.rounds[index]
        let round = d3.select(this)
        let allDone
        let fillcolor

        // *******PASSFAIL CIRCLES*******
        // only proceed if everyone has voted:
        if (roundData.passfails.indexOf(0) === -1)
          allDone = 1
        else
          allDone = 0
        round.selectAll('circle.passfail')
        .each(function(data, index) {

          if (!allDone && roundData.passfails[index] > 0) {
            d3.select(this)
            .transition()
            .duration(1000)
            .style('fill', _this.waitSmallColor)
          }
          else if (roundData.passfails[index] === 1)
            fillcolor = _this.passSmallColor
          else if (roundData.passfails[index] === 2)
            fillcolor = _this.failSmallColor
          if (allDone && roundData.passfails[index] > 0) {
            d3.select(this)
            .transition()
            .delay(1000 * index)
            .duration(1000)
            .style('fill', fillcolor)
          }
        })
        // ********************************

        // *******ROUND CIRCLES*******
        if (roundData.result != 0) {
          round
            .select('circle.round')
            // .style('fill', _this.roundColor)
            .transition()
            .delay(1000 * roundData.passfails.length)
            .duration(1000)
            .style('fill', () => {
              if (roundData.result > 0)
                return _this.passColor
              if (roundData.result < 0)
                return _this.failColor
            })
        }
        // ********************************

        // *******CURR CIRCLES*******
        if (_this.Game.model.currRound === index) {
          round
            .select('g.curr')
            .transition()
            .delay(3000)
            .duration(1000)
            .attr('opacity', 1)

          round
            .select('g.curr')
            .selectAll('circle.attempt')
            .transition()
            .duration(1000)
            .style('fill', (data, index) => {
              if (roundData.attempt >= index)
                return 'black'
              else
                return _this.bgColor
            })

        }
        else {
          round
            .select('g.curr')
            .transition()
            .duration(1000)
            .attr('opacity', 0)
          }

      })

  }
}

angular.module('resistanceApp')
  .directive('missionInfo', () => ({
    scope: {},
    bindToController: {},
    restrict: 'EA',
    controller: MissionInfoCtrl,
    controllerAs: '$ctrl',
    template: '<svg></svg>'
  }));
})();
