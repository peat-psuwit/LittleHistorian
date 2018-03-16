/* 
 * Source file for LittleArcheologist game manager.
 * Copyrighted 2014, Ratchanan Srirattanamet.
 * Part of Computer project subject of PSU.Wittayanusorn school.
 */

var GameManager = (function() {
    function GameManager(gameData) {
        if (!gameData || !gameData.characters || !gameData.level || !gameData.map) {
            throw new Error('gameData not found or invalid!');
        }
        
        this.navigator = new Navigator();
        this.characters = gameData.characters;
        this.map = gameData.map;
        this.level = gameData.level;
        
        this.choosenCharacter = -1|0;
        this.currentLevel = -1|0;
        this.currentQuiz = -1|0;
        this.score = 0|0;
        this.scoreHook = [];
        
        this.quizsStatus = [];
        for (var i = 0; i < this.level.length; i++) {
            this.quizsStatus[i] = [];
            for (var j = 0; j < this.level[i].quizs.length; j++) {
                this.quizsStatus[i].push(GameManager.Status.STATUS_LOCKED);
            }
        }
        this.quizsStatus[0][0] = GameManager.Status.STATUS_UNLOCKED;
    };
    
    /*GameManager.prototype.addScoreHook = function (fn) {
        if (typeof fn === "function") {
            this.scoreHook.push(fn);
            return this.scoreHook.length;
        }
        else {
            return -1;
        }
    };
    
    GameManager.prototype.setScore = function (newScore) {
        this.score = newScore;
        for (var i in this.scoreHook) {
            this.scoreHook[i]();
        }
    };
    
    GameManager.prototype.removeScoreHook = function (fnNumber) {
        if (this.scoreHook.length > fnNumber) {
            //this.scoreHook.splice(fnNumber);
            this.scoreHook[fnNumber] = null;
            var gameManager = this;
            setTimeout(function () {
                for (i in gameManager) {
                    if (gameManager.scoreHook[i] !== null) {
                        return;
                    }
                }
                
                gameManager.scoreHook = [];
            }, 0);
        }
    };*/
    
    GameManager.prototype.levelStatus = function (level) {
        if (level >= this.quizsStatus.length) {
            return -1; // There's no such level.
        }
        
        var clearedQuizs = 0, unlockedQuiz = 0;
        
        for (var i in this.quizsStatus[level]) {
            if (this.quizsStatus[level][i] === GameManager.Status.STATUS_CLEAR) {
                clearedQuizs++;
            }
            else if (this.quizsStatus[level][i] === GameManager.Status.STATUS_UNLOCKED) {
                unlockedQuiz++;
            }
        }
        
        if (clearedQuizs === this.quizsStatus[level].length) {
            return GameManager.Status.STATUS_CLEAR;
        }
        else if (unlockedQuiz === 0) {
            return GameManager.Status.STATUS_LOCKED;
        }
        else {
            return GameManager.Status.STATUS_UNLOCKED;
        }
        
        return true;
    };
    
    GameManager.Status = {
            STATUS_LOCKED: 0,
            STATUS_UNLOCKED: 1,
            STATUS_CLEAR: 2
    };
    
    return GameManager;
})();