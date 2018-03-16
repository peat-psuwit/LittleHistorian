/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

pageJSLauncher(function() {
    var stage = null;
    var kjsClickLayer = null;
    var kjsHiddenButton = [];
    
    var onResize = function () {
        // browser viewport size
        var w = window.innerWidth;
        if (w > 1200) {
            w = 1170;
        }
        else if (w > 992) {
            w = 970;
        }
        else if (w > 768) {
            w = 750;
        }
        else {
            w = w - 10;
        }
        var h = window.innerHeight - 10;

        // stage dimensions
        var ow = 800; // your stage width
        var oh = 500; // your stage height
        var keepAspectRatio = true;
        if (keepAspectRatio) {
            // keep aspect ratio
            var scale = Math.min(w / ow, h / oh);
            stage.setScale({
                x:scale,
                y:scale
            });
            // adjust canvas size
            stage.setSize({
                width:ow * scale,
                height:oh * scale
            });
        }   
        else {
            // scale to exact fit
            stage.setScale({
                x:(w / ow),
                y:(h / oh)
            });
            // adjust canvas size
            stage.setSize({
                width:w,
                height:h
            });
        }

        // update the stage
        stage.draw();
    };
    
    gameManager.navigator.addHook("navigateTo", "tresureFindingPage", function(prevPage, doNavigateToFn) {
        if (!stage) {
            stage = new Kinetic.Stage({
                container: "tresureFindingPageCanvas",
                width: 800,
                height: 500
            });
            
            //Background
            var kjsBgLayer = new Kinetic.Layer({
                id: "background"
            });
            
            var kjsBgImage = new Kinetic.Image({
                x: 0,
                y: 0,
                width: 800,
                height: 500
            });
            kjsBgLayer.add(kjsBgImage);
            
            var kjsText = new Kinetic.Text({
                text: "คลิกตรงไหนก็ได้เพื่อสุ่มตำแหน่งของหีบสมบัติ",
                x: 100,
                y: 25,
                fill: "white",
                fontSize: 30
            });
            kjsBgLayer.add(kjsText);
            
            stage.add(kjsBgLayer);
            
            var bgImg = document.createElement("img");
            bgImg.src = "img/treasureFinding/map.jpg";
            
            //Hidden box
            kjsClickLayer = new Kinetic.Layer({
                id: "click"
            });
            
            function onHiddenButtonClick(evt) {
                var i = jQuery.inArray(evt.target, kjsHiddenButton);
                var score = (i + 1) * 10;
                gameManager.score += score;
                $('#tresureFindingPageResultScore').text(score);
                $('#tresureFindingPageResultModal').modal('show');
            }
            
            for (var i=0; i<3; i++) {
                kjsHiddenButton.push(new Kinetic.Rect({
                    x:  Math.random() * 700,
                    y: (Math.random() * 350) + 100,
                    width: 100,
                    height: 100
                }));
                kjsHiddenButton[i].on("click tap", onHiddenButtonClick);
                kjsClickLayer.add(kjsHiddenButton[i]);
            }
            
            stage.add(kjsClickLayer);
            
            imagesLoaded(bgImg, function() {
                kjsBgImage.setImage(bgImg);
                stage.draw();
                doNavigateToFn(function() {
                    $('#tresureFindingPageGreetingModal').modal('show');
                    $(window).on('resize.keneticjs',onResize);
                });
            });
        }
        else {
            doNavigateToFn(function() {
                $('#tresureFindingPageGreetingModal').modal('show');
                $(window).on('resize.keneticjs',onResize);
            });
        }
        
        onResize();
    });
    
    gameManager.navigator.addHook("navigateFrom", "treasureFindingPage", function(nextPage, doNavigateFromFn) {
        doNavigateFromFn(function() {
            $(window).off('resize.keneticjs');
        });
    });
    
    $('#tresureFindingPageResultModal').on('hidden.bs.modal', function() {
        gameManager.navigator.navigateTo('scorePage');
    });
    
    $('#tresureFindingPageCont').on('click', function() {
        $('#tresureFindingPageResultModal').modal('hide');
    });
});
