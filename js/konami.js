"use strict";

(function () {

    // initial set up of the lives
    var lives = 3;
    $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");

    // konami code cheat
    //  ↑ ↑ ↓ ↓ ← → ← → B A
    var startingString = "";
    $(document).keyup(function (event) {
        startingString += event.keyCode;
        if (startingString === "3838404037393739666513") {
            alert("You have added 30 lives!");
            lives += 30;
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
        }

    });

    //start the matching game
    $('.play-matching').click(function () {
        start();
    });
    //rules for the matching game
    $('.rules-matching').click(function () {
        alert("You will be shown the cards for three seconds. Try to memorize their location as best as possible. Once they flip over, try to match the pairs by clicking on each card. Each wrong match will cost you a life. Match all the pairs and you win the game! If you win the game, you will be awarded 3 extra lives.");
    })
    //return to the home screen
    $('.returnHome').click(function () {
        homeScreen();
    })
    // start the minesweeper game
    $('.play-minesweeper').click(function () {
        startMineSweeper();
    })
    //rules for the minesweeper game
    $('.rules-minesweeper').click(function () {
        alert("The goal of the game is to uncover every square that does not contain a mine. If you click on an empty square, all surrounding squares that do not contain a mine will be shown. The numbers revealed on the squares indicated that there are that amount of mines nearby. The mine(s) nearby can either be directly left, right, up, down, or diagonal from the square. To mark a square that you suspect to be a mine, hit the 'flag' button and then click the square. Hit the flag button again to resume playing. Once all squares that do not contain a mine have been revealed, you win the game! Winning grants you 3 extra lives. If you click a square containing a mine, you lose! Good luck!")
    })


    // MATCHING PAIRS CODE
    // variables
    var flipped = 0;
    var choices = [];
    var solved = [];

    //creating the cards
    var cardOne = generateCard("otter", "fa-sharp fa-solid fa-otter", "Otter")
    var cardTwo = generateCard("cat", "fa-solid fa-cat", "Cat")
    var cardThree = generateCard("dragon", "fa-solid fa-dragon", "Dragon")
    var cardFour = generateCard("dove", "fa-solid fa-dove", "Dove")
    var cardFive = generateCard("fish", "fa-solid fa-fish", "Fish");
    var cardSix = generateCard("worm", "fa-solid fa-worm", "Worm");

    //function that is called to create the cards
    function generateCard(divName, iconString, header) {
        return `<div class="card-container" name="${divName}">` +
            `<div class="card"><div class="front">` +
            `<h1>?</h1>` +
            `</div>` +
            `<div class="back">` +
            `<i class="${iconString}"></i>` +
            `<h4>${header}</h4>` +
            `</div>` +
            `</div>` +
            `</div>`;
    }

    //functions
    function start() {
        if (lives > 0) {
            $('#home').css('display', 'none');
            $('#matching-game').css('display', 'block');
            randomizeOrder();
            showCards();
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
            flipped = 0;
            choices = [];
            solved = [];
            var timeout = setTimeout(function () {
                setEventListeners();
            }, 4000)
        } else {
            alert("You have no lives left to play with!");
            homeScreen();
        }


    }

    function showCards() {
        $('.card-container > .card').addClass('flip');
        var timeout = setTimeout(function () {
            $('.card-container > .card').removeClass('flip');
        }, 3000)
    }

    function randomizeOrder() {
        var cards = [cardOne, cardOne, cardTwo, cardTwo, cardThree, cardThree, cardFour, cardFour, cardFive, cardFive, cardSix, cardSix];
        var index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var picked = [];
        while (picked.length < 12) {
            var randomIndex = Math.floor(Math.random() * index.length);
            var item = index[randomIndex];
            if (picked.includes(item)) {
            } else {
                picked.push(item);
            }
        }
        $('.wrapperOne').html(cards[picked[0]] + cards[picked[1]] + cards[picked[2]] + cards[picked[3]]);
        $('.wrapperTwo').html(cards[picked[4]] + cards[picked[5]] + cards[picked[6]] + cards[picked[7]]);
        $('.wrapperThree').html(cards[picked[8]] + cards[picked[9]] + cards[picked[10]] + cards[picked[11]]);
    }

    function dynamicEventListeners(start, end) {
        for (var i = start; i < end; i++) {
            var selector = ".card-container:eq(" + i + ")";
            $(selector).click(function () {
                var i = 0;
                var child = this;
                while ((child = child.previousSibling) != null) {
                    i++
                }
                i += start;
                mainGamePlay(i);
            });
        }
    }

    function setEventListeners() {
        // wrapper one
        dynamicEventListeners(0, 4);
        //wrapper two
        dynamicEventListeners(4, 8);
        //wrapper three
        dynamicEventListeners(8, 12);

    }

    function mainGamePlay(itemNo) {
        var cardSelector = ".card-container:eq(" + itemNo + ") > .card";
        var selector = ".card-container:eq(" + itemNo + ")"
        var cardName = $(selector).attr("name");
        flip(cardSelector, selector);
        choose(cardName);
    }

    function flip(cardSelector, selector) {
        $(cardSelector).addClass('flip');
        $(selector).off('click');
        flipped += 1;
        if (flipped === 2) {
            $('.card-container').off('click');
        }
    }

    function hideSolved() {
        solved.forEach(function (card) {
            var selector = 'div[name="' + card + '"]';
            $(selector).addClass('hide');
            $(selector).off('click');
        })
    }

    function choose(cardName) {
        choices.push(cardName);
        if (choices.length == 2) {
            if (choices[0] == choices[1]) {
                winner(choices);
            } else {
                loser(choices);
            }
        }
    }

    function winner(choicesArray) {
        solved.push(choicesArray[0]);
        solved.push(choicesArray[1]);
        if (solved.length == 12) {
            hideSolved();
            var timeout = setTimeout(function () {
                alert('YOU WIN!')
                lives += 3;
                $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
                var answer = confirm("Would you like to play again?");
                playAgain(answer);
            }, 1000)
        }
        reset();

    }

    function loser(choices) {
        var cardSelectorOne = 'div[name="' + choices[0] + '"] > .card'
        var cardSelectorTwo = 'div[name="' + choices[1] + '"] > .card'
        var timeout = setTimeout(function () {
            $(cardSelectorOne).removeClass('flip');
            $(cardSelectorOne).off('click');
            $(cardSelectorTwo).removeClass('flip');
            $(cardSelectorTwo).off('click');
            lives -= 1;
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
            if (lives <= 0) {
                var timeout = setTimeout(function () {
                    alert('You are out of lives!');
                    homeScreen();
                }, 1000);
            } else {
                reset();
            }
        }, 1000);
    }

    function playAgain(answer) {
        if (answer) {
            $('.card-container').removeClass('hide');
            $('.card-container > .card').removeClass('flip');
            start();
        } else {
            homeScreen();
        }
    }

    function reset() {
        flipped = 0;
        choices = [];
        var timeout = setTimeout(function () {
            setEventListeners();
            hideSolved();
        }, 1000)
    }

    function homeScreen() {
        $("#matching-game").css('display', 'none');
        $("#minesweeper-game").css('display', 'none');
        $('#home').css('display', 'block');
    }


    //MINESWEEPER CODE
    //enabling flag controls
    var flagged = false;
    $('#flag').click(function () {
        if (flagged == false) {
            flagged = true;
            $("#flag").addClass('flagged-button');
        } else {
            flagged = false;
            $("#flag").removeClass('flagged-button');
        }
    })

    //variables designed to exclude certain blocks (end blocks) for checking if there's mines around
    var specialNexts = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225];
    var specialPrevs = [1, 16, 31, 46, 61, 76, 91, 106, 121, 136, 151, 166, 181, 196, 211];
    var specialBelow = [211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225]
    var specialBelowLeft = [1, 16, 31, 46, 61, 76, 91, 106, 121, 136, 151, 166, 181, 196, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225];
    var specialBelowRight = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225];
    var specialAbove = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var specialAboveLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 31, 46, 61, 76, 91, 106, 121, 136, 151, 166, 181, 196, 211];
    var specialAboveRight = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225];

    //functions
    function startMineSweeper() {
        if (lives > 0) {
            $('#home').css('display', 'none');
            $('#minesweeper-game').css('display', 'block');
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");

            $('.wrapper').replaceWith('<div class="wrapper"></div>');

            <!--  225 squares total-->
            for (var i = 0; i < 185; i++) {
                $(".wrapper").append("<div></div>");
            }

            randomMinePlacement();
            clues();

            $('.wrapper div').click(function () {
                if (flagged) {
                    if ($(this).hasClass('flagged')) {
                        $(this).removeClass('flagged');
                    } else {
                        $(this).addClass('flagged');
                    }
                    var countFlags = 0;
                    for (var i = 1; i < 226; i++) {
                        var selector = ".wrapper div:nth-child(" + i + ")";
                        if ($(selector).hasClass('flagged')) {
                            countFlags += 1;
                        }
                    }
                    $('#flagNumber').html('<p id="flagNumber">Current Number of Flags Placed: ' + countFlags + '</p>')
                } else {
                    if ($(this).hasClass("mine")) {
                        hitAMine(this);
                    } else if ($(this).text() != "") {
                        reveal(this);
                    } else {
                        var currentPosition = getChildNumber(this);
                        clearArea(currentPosition);
                    }
                }
                winMineSweeper();
            });
        } else {
            alert("You have no lives to play with!");
            homeScreen();
        }


    }

    function randomMinePlacement() {
        var mines = []
        while (mines.length < 40) {
            //gives random number 1-215
            var randomIndex = (Math.floor(Math.random() * 185) + 1);
            if (!mines.includes(randomIndex)) {
                mines.push(randomIndex);
                var selector = ".wrapper div:nth-child(" + randomIndex + ")";
                $(selector).after("<div class='mine'></div>");
            }
        }
    }

    function clues() {
        for (var i = 1; i < 226; i++) {
            var counter = 0;
            var selector = ".wrapper div:nth-child(" + i + ")";
            if (!$(selector).hasClass('mine')) {
                //mine left
                if (($(selector).prev().hasClass('mine')) && !specialPrevs.includes(i)) {
                    counter += 1;
                }

                //mine right
                if (($(selector).next().hasClass('mine')) && !specialNexts.includes(i)) {
                    counter += 1;
                }

                // mine below
                if (($(".wrapper div").slice(i + 14, i + 15).hasClass('mine')) && !specialBelow.includes(i)) {
                    counter += 1;
                }

                // mine bottom right
                if (($(".wrapper div").slice(i + 15, i + 16).hasClass('mine')) && !specialBelowRight.includes(i)) {
                    counter += 1;
                }

                //mine below left
                if (($(".wrapper div").slice(i + 13, i + 14).hasClass('mine')) && !specialBelowLeft.includes(i)) {
                    counter += 1;
                }

                // mine above right
                if (($(".wrapper div").slice(i - 15, i - 14).hasClass('mine')) && !specialAboveRight.includes(i)) {
                    counter += 1;
                }

                // above
                if (($(".wrapper div").slice(i - 16, i - 15).hasClass('mine')) && !specialAbove.includes(i)) {
                    counter += 1;
                }

                // mine above left
                if (($(".wrapper div").slice(i - 17, i - 16).hasClass('mine')) && !specialAboveLeft.includes(i)) {
                    counter += 1;
                }


                if (!counter == 0) {
                    $(selector).text(counter);
                }
            }

        }
    }

    function reveal(element) {
        $(element).addClass("show");
        $(element).removeClass("flagged");
    }

    function winMineSweeper() {
        var counter = 0;
        for (var i = 1; i < 226; i++) {
            var selector = ".wrapper div:nth-child(" + i + ")";
            if ($(selector).hasClass('show') || $(selector).hasClass('mine')) {
                counter += 1;
            }
        }
        if (counter == 225) {
            alert("YOU WIN!!");
            lives += 3;
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
            var answer = confirm("Would you like to play again?");
            if (answer) {
                startMineSweeper();
            } else {
                homeScreen();
            }
        }
    }

    function hitAMine(mine) {
        $(mine).addClass('mine-show');
        $(mine).removeClass("flagged");
        var timeout = setTimeout(function () {
            alert("Uh oh! You hit a mine! You lose!");
            lives -= 1;
            $('#lives').replaceWith("<p id='lives'>Lives: " + lives + "</p>");
            var answer = confirm("Would you like to play again?");
            if (answer) {
                $('#flagNumber').html('<p id="flagNumber">Current Number of Flags Placed: 0</p>')
                startMineSweeper();
            } else {
                homeScreen();
            }
        }, 50);

    }

    function getChildNumber(selector) {
        var count = 0;
        var selectorCount = selector;
        while (typeof $(selectorCount).prev().prop('nodeName') != 'undefined') {
            count += 1;

            selectorCount = $(selectorCount).prev();
        }
        return count + 1;
    }

    function clearArea(iteration) {
        var selector = ".wrapper div:nth-child(" + iteration + ")";
        var nextLeft = ".wrapper div:nth-child(" + (iteration - 1) + ")";
        var nextRight = ".wrapper div:nth-child(" + (iteration + 1) + ")";
        var nextAbove = ".wrapper div:nth-child(" + (iteration - 15) + ")";
        var nextBelow = ".wrapper div:nth-child(" + (iteration + 15) + ")";
        var nextAboveRight = ".wrapper div:nth-child(" + (iteration - 14) + ")";
        var nextBelowRight = ".wrapper div:nth-child(" + (iteration + 16) + ")";
        var nextAboveLeft = ".wrapper div:nth-child(" + (iteration - 16) + ")";
        var nextBelowLeft = ".wrapper div:nth-child(" + (iteration + 14) + ")";
        $(selector).addClass('show');
        $(selector).removeClass("flagged");

        clearDirection(iteration, specialPrevs, nextLeft, -1);
        clearDirection(iteration, specialNexts, nextRight, 1);
        clearDirection(iteration, specialAbove, nextAbove, -15);
        clearDirection(iteration, specialBelow, nextBelow, +15);
        clearDirection(iteration, specialAboveRight, nextAboveRight, -14);
        clearDirection(iteration, specialBelowRight, nextBelowRight, 16);
        clearDirection(iteration, specialAboveLeft, nextAboveLeft, -16);
        clearDirection(iteration, specialBelowLeft, nextBelowLeft, 14)
    }

    function clearDirection(iteration, exclusiveArray, nextSelector, increment) {
        // var nextSelector = ".wrapper div:nth-child(" + (iteration + 1) + ")";
        if ($(nextSelector).text() != "" && !exclusiveArray.includes(iteration)) {
            $(nextSelector).addClass('show');
            $(nextSelector).removeClass("flagged");
        } else if (!exclusiveArray.includes(iteration) && $(nextSelector).text() == "" && !$(nextSelector).hasClass('show')) {
            clearArea(iteration + increment);
        }
    }

}());