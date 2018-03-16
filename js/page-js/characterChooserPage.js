/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


pageJSLauncher(function () {
    
    //Get info about available charactor from GameManager
    var charactors = gameManager.characters;

    for (var i in charactors) {
        var txt='<div class="col-md-2 col-centered">';
        txt += '<img src="' + charactors[i].img + '" />';
        txt += '<div>' + charactors[i].name + '</div>';
        txt += '</div>';
        
        $(txt).appendTo('#characterChooserPageCharacterPanel');
    }
    
    $('#characterChooserPageCharacterPanel > div').click(function() {
        $('#characterChooserPageCharacterPanel > div').removeClass('selected');
        $(this).addClass('selected');
        gameManager.choosenCharacter = $(this).index();
        $('#characterChooserPage #characterChooserPageCont.btn').removeClass('disabled');
    });
    
    $('#characterChooserPage #characterChooserPageBack.btn').click(function() {
        gameManager.navigator.navigateTo('firstPage');
    });
    
    $('#characterChooserPage #characterChooserPageCont.btn').click(function() {
        if (!$(this).hasClass('disabled')) {
            gameManager.navigator.navigateTo('mapPage');
        }
    });
});