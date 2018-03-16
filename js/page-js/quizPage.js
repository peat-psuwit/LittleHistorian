/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

pageJSLauncher(function() {
    //Constant
    var startScore = 15|0, reduceScorePerAns = 5|0;
    
    //Sound. Preferbly configurable, but it's now too complex.
    var correctSound = new Howl({
        urls: ['sounds/correct.m4a'],
        buffer: true,
        onend: function () {
            gameManager.navigator.navigateTo("knowledgePage");
        }
    });
    var wrongSound = [
        new Howl({
            urls: ['sounds/wrong-0-wrong-choice-left.m4a'],
            buffer: true
        }),
        new Howl({
            urls: ['sounds/wrong-1-wrong-choice-left.m4a'],
            buffer: true
        }),
        new Howl({
            urls: ['sounds/wrong-2-wrong-choice-left.m4a'],
            buffer: true
        })
    ];
    
    var level = -1|0, quiz = -1|0;
    var quizData = null;
    
    var ansCount = 0|0;
    
    gameManager.navigator.addHook('navigateTo', 'quizPage', function(prevPage, doNavigateToFn) {
        level = gameManager.currentLevel;
        quiz = gameManager.currentQuiz;
        quizData = gameManager.level[level].quizs[quiz];
        ansCount = 0;
        
        var $characterImg = $("#quizPageCharacterImage");
        if ($characterImg.attr("src") === undefined) {
            $characterImg.attr("src", gameManager.characters[gameManager.choosenCharacter].img)
                         .attr("alt", gameManager.characters[gameManager.choosenCharacter].name);
        }
        
        $("#quizPageQuestionText").text(quizData.question);
        
        var $choicesContainer = $("#quizPageChoicesContainer");
        $choicesContainer.empty();
        jQuery.each(quizData.choices, function(index, value) {
            $choicesContainer.append('<div class="col-sm-6 quizPageChoice"><div class="btn btn-default btn-block btn-lg">' + value + '</div></div>')
        });
        
        $(".quizPageChoice > .btn").on("click.choice", function(evt) {
            var $target = $(evt.target);
            var index = $target.parent().index();
            
            if (quizData.correctAns === index) {
                gameManager.quizsStatus[level][quiz] = GameManager.Status.STATUS_CLEAR;
                gameManager.score += startScore - (reduceScorePerAns * ansCount);
                
                $(".quizPageChoice > .btn").addClass("disabled");
                
                //Play sound
                correctSound.play(); //onend calls navigateTo().
                
                $(".quizPageChoice > .btn").off("click.choice");
            }
            else {
                $target.addClass("disabled")
                       .off("click.choice");
                ansCount++;
                if (wrongSound[quizData.choices.length - ansCount - 1]) {
                    wrongSound[quizData.choices.length - ansCount - 1].play();
                }
            }
        });
        
        $("#quizPageImage").attr("src", quizData.img)
                           .imagesLoaded(function () {
            var $image = $("#quizPageImage");
            var aspectRatio = $image[0].naturalWidth/$image[0].naturalHeight;

            // Conditional statement
            if(aspectRatio > 1) {
                // Image is landscape
                $image.css({
                    width: "75%"
                    
                });
            } else if (aspectRatio < 1) {
                // Image is portrait
                $image.css({
                    width: "40%"
                });
            } else {
                // Image is square
                $image.css({
                    width: "40%"
                });            
            }
            doNavigateToFn();
        });
    });
    
    gameManager.navigator.addHook('navigateFrom', 'quizPage', function(nextPage, doNavigateAwayFn) {
        doNavigateAwayFn(function() {
            $(".quizPageChoice > .btn").off("click.choice");
            
            quizData = null;
            quiz = -1;
            level = -1;
        });
    });
});
