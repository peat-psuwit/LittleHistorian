/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

pageJSLauncher(function() {
    $('#firstPage #firstPagePlay.btn').on("click", function() {
        gameManager.navigator.navigateTo('characterChooserPage');
    });
});
