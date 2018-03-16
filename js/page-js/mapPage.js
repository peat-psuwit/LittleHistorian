/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


pageJSLauncher(function() {
    var map = gameManager.map;
    var stage = null;
    
    var images = {};
    
    var kjsBackgroundImage = null, kjsIslandsImages = [], kjsLines = [];
    var kjsTweens;
    
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
    
    var islandOnClickHandler = function(evt) {
        var islandIndex = jQuery.inArray(evt.target, kjsIslandsImages);
        if (gameManager.levelStatus(map.islands[islandIndex].level) === GameManager.Status.STATUS_UNLOCKED) {
            gameManager.currentLevel = map.islands[islandIndex].level;
            gameManager.currentQuiz = 0;
            gameManager.navigator.navigateTo('quizPage');
        }
    };
    
    var updateCanvas = function() {
        //Island image selector
        for (var i in map.islands) {
            var levelStatus = gameManager.levelStatus(map.islands[i].level);
            if (levelStatus === GameManager.Status.STATUS_CLEAR || levelStatus === -1) {
                kjsIslandsImages[i].setImage(images.clearedIslandImage);
            }
            else if (levelStatus === GameManager.Status.STATUS_UNLOCKED) {
                kjsIslandsImages[i].setImage(images.unlockedIslandImage);
            }
            else if (levelStatus === GameManager.Status.STATUS_LOCKED) {
                kjsIslandsImages[i].setImage(images.lockedIslandImage);
            }
        }

        //Path conditional appear
        kjsTweens = [];
        for (var i in map.lines) {
            if (map.lines[i].clearedLevel !== undefined) {
                if (gameManager.levelStatus(map.lines[i].clearedLevel) === GameManager.Status.STATUS_CLEAR && 
                    kjsLines[i].opacity() === 0) {
                    kjsTweens.push(new Kinetic.Tween({
                        node: kjsLines[i],
                        duration: 1,
                        opacity: 1
                    }));
                }
            }
        }

        onResize();
    };
    
    gameManager.navigator.addHook("navigateTo", "mapPage", function(prevPage, doNavigateToFn) {
        if (!stage) {
        
            stage = new Kinetic.Stage({
                container: 'mapPageCanvas',
                width: 800,
                height: 500
            });

            var backgroundLayer = new Kinetic.Layer({id: 'background'});
            var islandsLayer = new Kinetic.Layer({id: 'islands'});
            var pathsLayer = new Kinetic.Layer({id: 'paths'});
            
            //Background
            (function() {
                kjsBackgroundImage = new Kinetic.Image({
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 500
                });
                
                backgroundLayer.add(kjsBackgroundImage);
            })();
            
            //Each islands
            (function() {
                for (var i in map.islands) {
                    kjsIslandsImages.push(new Kinetic.Image({
                        width: map.islands[i].width,
                        height: map.islands[i].height,
                        x: map.islands[i].x,
                        y: map.islands[i].y
                    }));
                    
                    kjsIslandsImages[i].on('click tap', islandOnClickHandler);
                    
                    islandsLayer.add(kjsIslandsImages[i]);
                }
            })();
            
            //Paths
            (function () {
                for (var i in map.lines) {
                    kjsLines.push(new Kinetic.Line({
                        tension: map.lines[i].tension,
                        points: map.lines[i].points,
                        stroke: 'black',
                        dash: [20, 10]
                    }));
                    
                    if (map.lines[i].clearedLevel !== undefined) {
                        kjsLines[i].opacity(0);
                    }
                    
                    pathsLayer.add(kjsLines[i]);
                }
            })();
            
            stage.add(backgroundLayer);
            stage.add(islandsLayer);
            stage.add(pathsLayer);
            
            images.backgroundImage = document.createElement("img");
            images.backgroundImage.src = map.backgroundImage;
            imagesLoaded(images.backgroundImage, function() {
                kjsBackgroundImage.setImage(images.backgroundImage);
                stage.draw();
            });
            
            images.clearedIslandImage = document.createElement("img");
            images.clearedIslandImage.src = map.clearedIslandImage;
            images.unlockedIslandImage = document.createElement("img");
            images.unlockedIslandImage.src = map.unlockedIslandImage;
            images.lockedIslandImage = document.createElement("img");
            images.lockedIslandImage.src = map.lockedIslandImage;
            imagesLoaded([images.clearedIslandImage, images.unlockedIslandImage, images.lockedIslandImage], function() {
                updateCanvas();
                doNavigateToFn(function() {
                    for (var i in kjsTweens) {
                        kjsTweens[i].play();
                    }
                    $(window).on('resize.keneticjs',onResize);
                });
            });
        }
        else {
            updateCanvas();
            doNavigateToFn(function() {
                for (var i in kjsTweens) {
                    kjsTweens[i].play();
                }
                $(window).on('resize.keneticjs',onResize);
            });
        }
    });
    
    gameManager.navigator.addHook("navigateFrom", "mapPage", function(nextPage, doNavigateAwayFn) {
        doNavigateAwayFn(function() {
            //De-registering resize handler
            $(window).off('resize.keneticjs');
        });
    });
    
    /*$('#mapPage #mapPageCanvas').on('click', function(e) {
        //Function should determine what is clicked.
        gameManager.navigator.navigateTo('quizPage');
    });*/ //We'll use Kinetic.js's event handler.
});
