/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


pageJSLauncher(function() {
    gameManager.navigator.addHook('navigateTo', 'scorePage', function(prevPage, doNavigateToFn) {
        //Update the score from game manager.
        $('#scorePageScoreNumber').text(gameManager.score);
        doNavigateToFn();
    });
    
    $('#scorePage #scorePageCont').on('click', function() {
        gameManager.navigator.navigateTo('creditPage');
    });
});