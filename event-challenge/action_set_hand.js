// ====================================================================================================
//
// Cloud Code for action_set_hand, write your code here to customise the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://portal.gamesparks.net/docs.htm			
//
// ====================================================================================================
require("dealer");
require("gamestate");

//Load challenge
var chal = Spark.getChallenge(Spark.getData().challengeInstanceId);

//Retrieve player Id
var pId = Spark.getPlayer().getPlayerId();
//Retrieve player stats
var playerStats = chal.getScriptData("playerStats");

if (playerStats[pId].hasPulled)
{
    playerStats[pId].hasPulled = false;
    //playerStats[pId].cardsPulled = 0;

    var gameBoards = chal.getScriptData("gameBoards");

    // grab the cards that the user set
    var hand = Spark.data.hand;

    // create arrays if they are not already set
    if (hand.top && !gameBoards[pId].top) {
        gameBoards[pId].top = [];
    }

    if (hand.mid && !gameBoards[pId].mid) {
        gameBoards[pId].mid = [];
    }

    if (hand.bot && !gameBoards[pId].bot) {
        gameBoards[pId].bot = [];
    }
    
    // set this player's board to the hand sent by client
    if (hand.top) {
        gameBoards[pId].top = gameBoards[pId].top.concat(hand.top);
    }

    if (hand.mid) {
        gameBoards[pId].mid = gameBoards[pId].mid.concat(hand.mid);
    }

    if (hand.bot) {
        gameBoards[pId].bot = gameBoards[pId].bot.concat(hand.bot);
    }

	// update our stats
    var num = gameBoards[pId].top.length + gameBoards[pId].mid.length + gameBoards[pId].bot.length;
    playerStats[pId].cardsPlaced = num;
    if (num == 13) {
      playerStats[pId].completed = true;
  } else {
      playerStats[pId].completed = false;
  }

  chal.setScriptData("lastMove", hand);
  chal.setScriptData("gameBoards", gameBoards);
  chal.setScriptData("playerStats", playerStats);
    /*
    if (playerStats[pId].hasPulled === false){

        //Retrieve current hands
        var currentHand = chal.getScriptData("currentHand");

        //Run the sequence to pull a new card
        require("dealer");
        
        //drawCard(pId);

        //Player can't pull another card this round
        playerStats[pId].hasPulled = true;

        //Save current hand and player stats
        chal.setScriptData("currentHand", currentHand);
        chal.setScriptData("playerStats", playerStats);
    } else {
        Spark.setScriptError("Error", "Already pulled card this round");
    }
    */

    // if we're the dealer, increment the turn counter
    var gameState = chal.getScriptData("gameState"); 
    if (gameState.dealer == pId) {
        gameState.turn++;
    }

    chal.setScriptData("gameState", gameState);
    // TODO: might not be right to pass the turn.
	// check the board, see if there are more moves to play; others might be in fantasy land too
	var finalMove = IsFinalMove(chal);

	// if it's the final move, let's do scoring 
	// then pass turn
	if (finalMove) {
		chal.setScriptData("stillTurn", true);
	} else {
		chal.setScriptData("stillTurn", false);
		chal.setScriptData("isFinalMove", finalMove);
		//Finish player turn
		chal.consumeTurn(pId);
	}
}
