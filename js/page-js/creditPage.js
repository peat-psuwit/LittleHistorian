/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

pageJSLauncher(function() {
    $('#creditPage #creditPageReplay').on('click', function() {
        //gameManager.navigator.navigateTo('firstPage'); 
        //Should I navigate to charactorChooserPage instead?
        location.reload();
    });
});