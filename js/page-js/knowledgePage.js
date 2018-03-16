/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

pageJSLauncher(function () {
    var sound = null;
    
    var navigateNext = function () {
        if (gameManager.levelStatus(gameManager.currentLevel) === GameManager.Status.STATUS_CLEAR) {
            if (gameManager.level.length - gameManager.currentLevel === 1) {
                gameManager.navigator.navigateTo('tresureFindingPage');
            }
            else {
                gameManager.quizsStatus[gameManager.currentLevel+1][0] = GameManager.Status.STATUS_UNLOCKED;
                gameManager.navigator.navigateTo('mapPage');
            }
        }
        else {
            if (gameManager.quizsStatus[gameManager.currentLevel][gameManager.currentQuiz] === GameManager.Status.STATUS_CLEAR) {
                gameManager.currentQuiz++;
                gameManager.quizsStatus[gameManager.currentLevel][gameManager.currentQuiz] = GameManager.Status.STATUS_UNLOCKED;
            }
            gameManager.navigator.navigateTo('quizPage');
        }
    }
    
    gameManager.navigator.addHook('navigateTo', 'knowledgePage', function(nextPage, doNavigateToFn){
        var knowledgeData;
        
        if   (gameManager.level[gameManager.currentLevel] 
           && gameManager.level[gameManager.currentLevel].knowledges 
           && gameManager.level[gameManager.currentLevel].knowledges[gameManager.currentQuiz]) {
                knowledgeData = gameManager.level[gameManager.currentLevel].knowledges[gameManager.currentQuiz];
        } else {
            knowledgeData = null;
        }
        
        if (knowledgeData) {
            $("#knowledgePageImage").attr("src", knowledgeData.img);
            sound = new Howl({
                urls: [knowledgeData.sound],
                buffer: true
            });
            $("#knowledgePageText").text(knowledgeData.text);

            doNavigateToFn(function () {
                if (sound) {
                    sound.play();
                }
            });
        }
        else {
            navigateNext(); //Not executing doNavigateToFn
        }
    });
    
    gameManager.navigator.addHook('navigateFrom', 'knowledgePage', function(nextPage, doNavigateAwayFn){
        if (sound) {
            sound.stop();
            sound = null;
        }
        doNavigateAwayFn();
    });
    
    $('#knowledgePage #knowledgePageCont').on('click', function() {
        //The function have to determine if it should navigate to quizPage, mapPage 
        //or tresureFindingPage.
        
        navigateNext();
    });
});