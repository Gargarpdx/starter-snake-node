const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)
console.log("garyscript1");
app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))

function handleIndex(request, response) {
  console.log("event=requestIndex");
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#001000',
    head: 'smile',
    tail: 'bolt'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body
  console.log("event=handleStart gameData=");
  console.log(gameData);

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body

  console.log("event=handleMove gameData=");
  console.dir(gameData,{depth:null});
 
  //var possibleMoves = ['up', 'down', 'left', 'right']
  //var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  
  console.log("turn = "+gameData.turn)
  
  let move = movementChoice(gameData)
  console.log("move = " + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}

function areCoordSame(coord0, coord1){
  console.log("areCoordSame " + coordToString(coord0) + coordToString(coord1))
  return (coord0.x === coord1.x && coord0.y === coord1.y)
}

function coordToString(coord){
  return "(" + coord.x + "," + coord.y + ")"
}
/**
 * this following function is to detect if there is a snake body or a wall in a spot that the program is thinking about going to
 */
function isSafeDestination(coordEst, gameData){
  console.log("isSafeDestination " + coordToString(coordEst))
  //check snake collision first
  for (let i = 0; i < gameData.board.snakes.length; i++ ){
    let snake = gameData.board.snakes[i]
    for (let i1 = 0; i1 < snake.body.length; i1++){
      let bodyCoord = snake.body[i1]
      if (areCoordSame(coordEst, bodyCoord)){
        console.log("body collision found")
        return false
      }
    }
  }
  //check wall collison next
  if (coordEst.x < 0){
    console.log("left wall detected")
    return false
  }
  if (coordEst.x > gameData.board.width - 1){
    console.log("right wall detected")
    return false
  }
  if (coordEst.y < 0){
    console.log("bottom wall detected")
    return false
  }
  if (coordEst.y > gameData.board.height - 1){
    console.log("top wall detected")
    return false
  }
  return true
}

function movementChoice(gameData){
  return dontDieDirection(gameData)
}

function dontDieDirection(gameData){
  //up
  console.log("trying up")
  let upCoord = {
    x: gameData.you.head.x,
    y: gameData.you.head.y + 1,
  }
  if (isSafeDestination(upCoord, gameData)){
    return "up"
  }
  //right
  console.log("trying right")
  let rightCoord = {
    x: gameData.you.head.x + 1,
    y: gameData.you.head.y,
  }
  if (isSafeDestination(rightCoord, gameData)){
    return "right"
  }
  //down
  console.log("trying down")
  let downCoord = {
    x: gameData.you.head.x,
    y: gameData.you.head.y - 1,
  }
  if (isSafeDestination(downCoord, gameData)){
    return "down"
  }
  //left
  console.log("trying left")
  let leftCoord = {
    x: gameData.you.head.x - 1,
    y: gameData.you.head.y,
  }
  if (isSafeDestination(leftCoord, gameData)){
    return "left"
  }
}

function getClosestFoodPlop(gamedata){
  //finding food
  console.log("finding food")
  let closestFood = null 
  let foodDistance = gameData.board.height + gameData.board.width
  for (let i = 0; i < gameData.board.food.length; i++){
    let foodPlop = gameData.board.food[i]
    let foodTravelSpace = findDistance(foodPlop, gameData.you.head)
    if (foodTravelSpace < foodDistance){
      closestFood = foodPlop 
      foodDistance = foodTravelSpace
    }

  }  
  console.log("found closest food " + coordToString(closestFood))
  return closestFood
}

function findDistance(coord0, coord1){
  return Math.abs(coord1.x - coord0.x) + Math.abs(coord1.y - coord0.y)
}