var player1_score = 0;
var player2_score = 0;
var currentPlayer = 1; //keeps track of whose turn it is.
var diceThrow = 0; //keeps track of how many times each player has thrown the dice.
var currentTurn = 1; //keeps track of which turn it is so we know when to call it quits and show final score.
var count = 0.5;
var name; //decides which player name to send to sql
var winner = "";
var looser = "";
var winnerScore = 0;
var looserScore = 0;

$("#button2").attr('disabled', 'disabled'); //makes sure player cant submit result without throwing dice once.
$('#endGame').hide();  //menu button that takes you back to first page once game has ended.

var result = ""; //result of all dices for sql display.
var combination = ["ones", "twos", "threes", "fours", "fives", "sixes"]; //different combinations


var die1; //dice
var die2; //dice
var die3; //dice
var die4; //dice
var die5; //dice

var d1; //dice
var d2; //dice
var d3; //dice
var d4; //dice
var d5; //dice

var die1Select = false; //variable checking if dice is selected A.K.A saved.
var die2Select = false; //variable checking if dice is selected A.K.A saved.
var die3Select = false; //variable checking if dice is selected A.K.A saved.
var die4Select = false; //variable checking if dice is selected A.K.A saved.
var die5Select = false; //variable checking if dice is selected A.K.A saved.

$('#waitingPlayer').hide();

//save player names for game purposes

$("#start_game").on("click", (function (e) {

    localStorage.player1 = $('#player_1').val();
    localStorage.player2 = $('#player_2').val();
    window.location.href = "page2.html";

}));


//assigns player entered names on previous page to variables used by page2. Displays player names.

$(document).ready(function () {

    $('#currentPlayer').text(localStorage.player1);
    $('#waitingPlayer').text(localStorage.player2);
    $('#player1Highscore').text(localStorage.player1);
    $('#player2Highscore').text(localStorage.player2);


});


//ajax call function to different URL.

$("#highscore > a").on("click", (function (e) {
    e.preventDefault();
    $.ajax({


        url: 'http://localhost:8080/highscore',
        method: 'GET',
        crossDomain: true,
        // async: false,
        // done: function (data) {
        success: function (data) {
            //console.log(data);

            $('#player1').text(data[0].name);
            $('#score1').text(data[0].score);
            $('#player2').text(data[1].name);
            $('#score2').text(data[1].score);
            $('#player3').text(data[2].name);
            $('#score3').text(data[2].score);
            $('#player4').text(data[3].name);
            $('#score4').text(data[3].score);
            $('#player5').text(data[4].name);
            $('#score5').text(data[4].score);
            $('#player6').text(data[5].name);
            $('#score6').text(data[5].score);
            $('#player7').text(data[6].name);
            $('#score7').text(data[6].score);
            $('#player8').text(data[7].name);
            $('#score8').text(data[7].score);
            $('#player9').text(data[8].name);
            $('#score9').text(data[8].score);
            $('#player10').text(data[9].name);
            $('#score10').text(data[9].score);


        }, error: function (er) {
            console.log(er)
        }
    });


}));

//bootstraff stuff to show new game popup screen

$(function popup() {
    $('[rel="popover"]').popover({
        container: 'body',
        html: true,
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function (e) {
        e.preventDefault();
    });
});


//button to view Player history

$("#player_submit").on("click", (function (e) {
    var player = $('#player_id').val();
    e.preventDefault();
    $.ajax({


        url: 'http://localhost:8080/person?name=' + player,
        method: 'GET',
        crossDomain: true,
        // async: false,
        // done: function (data) {
        success: function (data) {


            $('#round_id').text(data[0].roundID);
            $('#turn').text(data[0].turn);
            $('#player_id2').text(data[0].name);
            $('#result').text(data[0].result);
            $('#combination').text(data[0].combination);
            $('#points').text(data[0].points);

            $('#round_id1').text(data[1].roundID);
            $('#turn1').text(data[1].turn);

            $('#result1').text(data[1].result);
            $('#combination1').text(data[1].combination);
            $('#points1').text(data[1].points);

            $('#round_id2').text(data[2].roundID);
            $('#turn2').text(data[2].turn);

            $('#result2').text(data[2].result);
            $('#combination2').text(data[2].combination);
            $('#points2').text(data[2].points);

            $('#round_id3').text(data[3].roundID);
            $('#turn3').text(data[3].turn);

            $('#result3').text(data[3].result);
            $('#combination3').text(data[3].combination);
            $('#points3').text(data[3].points);

            $('#round_id4').text(data[4].roundID);
            $('#turn4').text(data[4].turn);

            $('#result4').text(data[4].result);
            $('#combination4').text(data[4].combination);
            $('#points4').text(data[4].points);

            $('#round_id5').text(data[5].roundID);
            $('#turn5').text(data[5].turn);

            $('#result5').text(data[5].result);
            $('#combination5').text(data[5].combination);
            $('#points5').text(data[5].points);


        }, error: function (er) {
            console.log(er)

        }
    });

}));


//view round history

$("#round_submit").on("click", (function (e) {
    var round = $('#round_id_input').val();
    e.preventDefault();
    $.ajax({


        url: 'http://localhost:8080/roundID?roundChoice=' + round,
        method: 'GET',
        crossDomain: true,
        // async: false,
        // done: function (data) {
        success: function (data) {

            $('#selectedRoundID').text(data[0].roundID);
            $('#winner').text(data[0].winner);
            $('#looser').text(data[0].looser);
            $('#date').text(data[0].date);
            $('#winnerScore').text(data[0].winnerScore);


        }, error: function (er) {
            console.log(er)

        }
    });

}));


////////////////////////////////////////
////////////////PAGE 2//////////////////
////////////////////////////////////////


//button to insert turn result to database.

$("#button2").click(function (e) {

    var points = 0; //reset points each turn to reuse variable
    count += 0.5; //makes sure currentTurn increases by 1 after both players have played.

    die1Select = false;     //reset any saved dices
    die2Select = false;     //reset any saved dices
    die3Select = false;     //reset any saved dices
    die4Select = false;     //reset any saved dices
    die5Select = false;     //reset any saved dices

    $('#die1').removeClass("dicesSelect"); //unselect dice for next player
    $('#die2').removeClass("dicesSelect"); //unselect dice for next player
    $('#die3').removeClass("dicesSelect"); //unselect dice for next player
    $('#die4').removeClass("dicesSelect"); //unselect dice for next player
    $('#die5').removeClass("dicesSelect"); //unselect dice for next player




    if (d1 == currentTurn) {
        points += d1;
    }
    if (d2 == currentTurn) {
        points += d2;
    }
    if (d3 == currentTurn) {
        points += d3;
    }
    if (d4 == currentTurn) {
        points += d4;
    }
    if (d5 == currentTurn) {
        points += d5;
    }

    //name for sql INSERT

    if (currentPlayer % 2 != 0) {
        name = $('#currentPlayer').text();
        player1_score += points;
    }
    else {
        name = $('#waitingPlayer').text();
        player2_score += points;
    }

    var result = d1.toString() + d2.toString() + d3.toString() + d4.toString() + d5.toString();

    switch (count) {

        case 1:
            $('#onesPlayer1').val(points);
            break;

        case 1.5:
            $('#onesPlayer2').val(points);
            break;
        case 2:
            $('#twosPlayer1').val(points);
            break;

        case 2.5:
            $('#twosPlayer2').val(points);
            break;

        case 3:
            $('#threesPlayer1').val(points);
            break;

        case 3.5:
            $('#threesPlayer2').val(points);
            break;

        case 4:
            $('#foursPlayer1').val(points);
            break;

        case 4.5:
            $('#foursPlayer2').val(points);
            break;

        case 5:
            $('#fivesPlayer1').val(points);
            break;

        case 5.5:
            $('#fivesPlayer2').val(points);
            break;

        case 6:
            $('#sixesPlayer1').val(points);
            break;

        case 6.5:
            $('#sixesPlayer2').val(points);
            break;

    }


    //values for sql INSERT to dbo.Turn

    var roundValues = points + '&combination=' + combination[(currentTurn - 1)] + '&name=' + name + '&result=' + result + '&currentTurn=' + currentTurn;
    e.preventDefault();
    $.ajax({


        url: 'http://localhost:8080/insertScore?points=' + roundValues,
        method: 'GET',
        crossDomain: true,
        async: false,
        complete: function (data) {
            console.log(data.responseText);

        }
    });

    currentPlayer++;    //increase value so correct player is displayed


    if (currentPlayer % 2 != 0) {
        $('#currentPlayer').show();     //changes player name displayed on main game page.
        $('#waitingPlayer').hide();     //changes player name displayed on main game page.
    }
    else {
        $('#waitingPlayer').show();     //changes player name displayed on main game page.
        $('#currentPlayer').hide();     //changes player name displayed on main game page.
    }


    result = result.replace("data-", "");   //reset Strings for next player
    name = name.replace("data-", "");   //reset Strings for next player


    if (count % 1 != 0) {     //increase turn once both players have played a turn.
        currentTurn++;
    }

    diceThrow = 0; // reset to show roll dice button for next player

    die1.innerHTML = 0; //reset dice for next player
    die2.innerHTML = 0; //reset dice for next player
    die3.innerHTML = 0; //reset dice for next player
    die4.innerHTML = 0; //reset dice for next player
    die5.innerHTML = 0; //reset dice for next player

    $('#button1').show(); //show roll dice button once player has submitted result.

    //calculates winner and displays result
    $("#back_to_game").click(function (e) {
        if (count == 6.5) {

            if (player1_score > player2_score) {
                alert('The winner is ' + localStorage.player1 + ' with ' + player1_score + '!');
                winner = localStorage.player1;
                winnerScore = player1_score;
                looser = localStorage.player2;
                looserScore = player2_score;
            }
            else {
                alert('The winner is ' + localStorage.player2 + ' with ' + player2_score + '!');
                winner = localStorage.player2;
                winnerScore = player2_score;
                looser = localStorage.player1;
                looserScore = player1_score;
            }

            $('#endGame').show();

            //values for sql INSERT to dbo.Round

            var roundValues = winner + '&looser=' + looser + '&winnerScore=' + winnerScore;

            $.ajax({


                url: 'http://localhost:8080/insertRoundStatistics?winner=' + roundValues,
                method: 'GET',
                crossDomain: true,
                async: false,
                complete: function (data) {
                    console.log(data.responseText);

                }
            });


            //values for sql INSERT to dbo.Player & dbo.Listofrounds

            var playerValues = winner + '&score1=' + winnerScore + '&name2=' + looser + '&score2=' + looserScore;
            //var roundValues = 'triton' + '&looser=' + 'blunder' + '&winnerScore=' + 500;

            $.ajax({


                url: 'http://localhost:8080/insertPlayers?name1=' + playerValues,
                method: 'GET',
                crossDomain: true,
                async: false,
                complete: function (data) {
                    console.log(data.responseText);

                }
            });





            $("#back_to_game").close();



        }

    });

    $("#button2").attr('disabled', 'disabled'); //prevents player from submitting results before throwing dice.

});


//button to insert every turn score.

$("#button1").click(function (e) {
    e.preventDefault();
    $("#button2").removeAttr('disabled'); //enables submit result after first throw.
    diceThrow++;

    if (diceThrow >= 3) {
        $('#button1').hide();
        diceThrow = 0;
    }


    if (die1Select == false) {                              //checks if die is selected or not
        d1 = Math.floor(Math.random() * 6) + 1;
        die1 = document.getElementById("die1");
        die1.innerHTML = d1;
    }

    if (die2Select == false) {                               //checks if die is selected or not
        d2 = Math.floor(Math.random() * 6) + 1;
        die2 = document.getElementById("die2");
        die2.innerHTML = d2;
    }

    if (die3Select == false) {                               //checks if die is selected or not
        d3 = Math.floor(Math.random() * 6) + 1;
        die3 = document.getElementById("die3");
        die3.innerHTML = d3;
    }

    if (die4Select == false) {                               //checks if die is selected or not
        d4 = Math.floor(Math.random() * 6) + 1;
        die4 = document.getElementById("die4");
        die4.innerHTML = d4;
    }

    if (die5Select == false) {                               //checks if die is selected or not
        d5 = Math.floor(Math.random() * 6) + 1;
        die5 = document.getElementById("die5");
        die5.innerHTML = d5;
    }

});


/**
 * the following 5 functions control the highlight effect of the dice once selected.
 */


$("#die1").click(function (e) {

    if (!die1Select) {
        $('#die1').addClass("dicesSelect")
        die1Select = true;
    }
    else if (die1Select) {
        $('#die1').removeClass("dicesSelect")
        die1Select = false;
    }
});

$("#die2").click(function (e) {

    if (!die2Select) {
        $('#die2').addClass("dicesSelect")
        die2Select = true;
    }
    else if (die2Select) {
        $('#die2').removeClass("dicesSelect")
        die2Select = false;
    }
});

$("#die3").click(function (e) {

    if (!die3Select) {
        $('#die3').addClass("dicesSelect")
        die3Select = true;
    }
    else if (die3Select) {
        $('#die3').removeClass("dicesSelect")
        die3Select = false;
    }
});

$("#die4").click(function (e) {

    if (!die4Select) {
        $('#die4').addClass("dicesSelect")
        die4Select = true;
    }
    else if (die4Select) {
        $('#die4').removeClass("dicesSelect")
        die4Select = false;
    }
});


$("#die5").click(function (e) {

    if (!die5Select) {
        $('#die5').addClass("dicesSelect")
        die5Select = true;
    }
    else if (die5Select) {
        $('#die5').removeClass("dicesSelect")
        die5Select = false;
    }
});



