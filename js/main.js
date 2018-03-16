var gameManager = null;
var onGameManagerCreate = [];

$(document).ready(function() {
    $('.page').hide();
    $('.page').css({'opacity': 1});
    $.getJSON('gameData.json', function(json) {
        gameManager = new GameManager(json);
        for (var i in onGameManagerCreate) {
            onGameManagerCreate[i]();
        }
        gameManager.navigator.navigateTo('firstPage'); // Default page
    });
});

function pageJSLauncher (fn) {
    if (!gameManager) {
        onGameManagerCreate.push(fn);
    }
    else {
        fn();
    }
}