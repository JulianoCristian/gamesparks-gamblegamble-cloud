// GLOBAL MESSAGE

// if we're not on the correct player, consume turn and move to next player
var challenge = Spark.getChallenge(Spark.getData().challenge.challengeId);
//var challengeInstanceId = Spark.getData().challenge.challengeId;
//var challenge = Spark.getChallenge(challengeInstanceId);
var nextPlayer = Spark.getData().challenge.nextPlayer;
var playerId = Spark.getPlayer().getPlayerId();

// use the given next player, shuffle the rest?
var gameState = challenge.getScriptData("gameState"); 
var playerOrder = challenge.getScriptData("playerOrder");
var playerStats = challenge.getScriptData("playerStats");

//var isFinalMove = challenge.getScriptData("isFinalMove");
challenge.setScriptData("turntaken_nextPlayer", nextPlayer);
challenge.setScriptData("turntaken_actionIndex", gameState.actionIndex);
Spark.setScriptData("turntaken_nextPlayer", nextPlayer);

if (nextPlayer == playerOrder[gameState.actionIndex])
{
	// check if the next player is in FL and has already gone; if so, skip him
	if (playerStats[nextPlayer].inFantasyLand && 
		playerStats[nextPlayer].cardsPlaced > 0)
	{
		// this guy is already done his Fl, skip
		challenge.consumeTurn(nextPlayer);
		challenge.setScriptData("turntaken_advanced", 2);
	}
	else
	{
		// we're on the correct player
		// let game continue
		challenge.setScriptData("turntaken_advanced", 0);
	}
}
else
{
	challenge.consumeTurn(nextPlayer);
	challenge.setScriptData("turntaken_advanced", 1);
}

// update our next player pointer
//nextPlayer = playerOrder[gameState.actionIndex];
challenge.setScriptData("nextPlayer", nextPlayer); // only used for debugging?
challenge.setScriptData("turnTakenPlayer", playerId);
Spark.setScriptData("turnTakenPlayer", playerId);
