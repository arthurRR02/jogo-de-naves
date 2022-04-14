
var shootingSound = document.getElementById("som-disparo")
var explosionSound = document.getElementById("som-explosao")
var music = document.getElementById("musica")
var gameOverSound = document.getElementById("som-game-over")
var lostSound = document.getElementById("som-perdido")
var rescueSound = document.getElementById("som-resgate")
var difficulty = "easy"

function start() {
    $("#inicio").hide()

    $("#fundo-game").append("<div id='jogador' class='animation1'></div>")
    $("#fundo-game").append("<div id=inimigo1 class='animation2'></div>")
    $("#fundo-game").append("<div id=inimigo2 ></div>")
    $("#fundo-game").append("<div id=amigo class='animation3'></div>")
    $("#fundo-game").append("<div id='placar'></div)")
    $("#fundo-game").append("<div id='energia'></div>")

    var game = {}
    var KEYBOARD_BUTTONS = {
        W: 87,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        S: 83,
        D: 68,
        Z: 90
    }
    var DIFFICULTIES = {
        EASY: "easy",
        MEDIUM: "medium",
        HARD: "hard"
    }
    var speedEnemyOne = 5
    var speedEnemyTwo = 3
    var yPosition = parseInt(Math.random() * 334)
    var canShot = true
    var endGame = false
    var score = 0
    var saved = 0
    var lost = 0
    var currentEnergy = 3
    var easySpeed = 0.3
    var mediumSpeed = 0.5
    var hardSpeed = 0.7

    game.pressed = []

    music.addEventListener("ended", function () {
        music.currentTime = 0
        music.play()
    })
    music.play();

    $(document).keydown(function (e) {
        game.pressed[e.which] = true
    });

    $(document).keyup(function (e) {
        game.pressed[e.which] = false
    });

    game.timer = setInterval(loop, 30)

    function loop() {
        moveBackground()
        movePlayer()
        moveEnemy1()
        moveEnemy2()
        moveFriend()
        collision()
        scoreboard()
        energy()
    }

    function moveBackground() {
        left = parseInt($("#fundo-game").css("background-position"))
        $("#fundo-game").css("background-position", left - 1)
    }

    function movePlayer() {
        if (game.pressed[KEYBOARD_BUTTONS.W] || game.pressed[KEYBOARD_BUTTONS.UP_ARROW]) {
            var top = parseInt($("#jogador").css("top"))
            $("#jogador").css("top", top - 10)

            if (top <= 0) {
                $("#jogador").css("top", top + 10)
            }

        } else if (game.pressed[KEYBOARD_BUTTONS.S] || game.pressed[KEYBOARD_BUTTONS.DOWN_ARROW]) {
            var top = parseInt($("#jogador").css("top"))
            $("#jogador").css("top", top + 10)

            if (top >= 440) {
                $("#jogador").css("top", top - 10)
            }

        } else if (game.pressed[KEYBOARD_BUTTONS.D] || game.pressed[KEYBOARD_BUTTONS.Z]) {
            shot()
        }
    }

    function moveEnemy1() {
        xPosition = parseInt($("#inimigo1").css("left"))
        $("#inimigo1").css("left", xPosition - speedEnemyOne)
        $("#inimigo1").css("top", yPosition)

        if (xPosition <= 0) {
            yPosition = parseInt(Math.random() * 334)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", yPosition)
        }
    }

    function moveEnemy2() {
        xPosition = parseInt($("#inimigo2").css("left"))
        $("#inimigo2").css("left", xPosition - speedEnemyTwo)

        if (xPosition <= 0) {
            $("#inimigo2").css("left", 775)
        }
    }

    function moveFriend() {
        xPosition = parseInt($("#amigo").css("left"))
        $("#amigo").css("left", xPosition + 1)

        if (xPosition > 906) {
            $("#amigo").css("left", 0)
        }
    }

    function shot() {
        if (canShot == true) {
            shootingSound.play()
            canShot = false
            var top = parseInt($("#jogador").css("top"))
            xPosition = parseInt($("#jogador").css("left"))
            xShot = xPosition + 190
            topShot = top + 42
            $("#fundo-game").append("<div id='disparo'></div>")
            $("#disparo").css("top", topShot)
            $("#disparo").css("left", xShot)

            var shootingTime = window.setInterval(runShot, 30)
        }

        function runShot() {
            xPosition = parseInt($("#disparo").css("left"))
            $("#disparo").css("left", xPosition + 15)

            if (xPosition > 900) {
                window.clearInterval(shootingTime)
                shootingTime = null
                $("#disparo").remove()
                canShot = true
            }
        }
    }

    function collision() {
        var collision1 = ($("#jogador").collision($("#inimigo1")))
        var collision2 = ($("#jogador").collision($("#inimigo2")))
        var collision3 = ($("#disparo").collision($("#inimigo1")))
        var collision4 = ($("#disparo").collision($("#inimigo2")))
        var collision5 = ($("#jogador").collision($("#amigo")))
        var collision6 = ($("#inimigo2").collision($("#amigo")))

        if (collision1.length > 0) {
            currentEnergy--
            xEnemyOne = parseInt($("#inimigo1").css("left"))
            yEnemyOne = parseInt($("#inimigo1").css("top"))
            explosion1(xEnemyOne, yEnemyOne)

            yPosition = parseInt(Math.random() * 334)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", yPosition)
        }

        if (collision2.length > 0) {
            currentEnergy--
            xEnemyTwo = parseInt($("#inimigo2").css("left"))
            yEnemyTwo = parseInt($("#inimigo2").css("top"))
            explosion2(xEnemyTwo, yEnemyTwo)

            $("#inimigo2").remove()
            repositionEnemyTwo()
        }

        if (collision3.length > 0) {
            if(difficulty == DIFFICULTIES.EASY){
                speedEnemyOne += easySpeed
            } else if(difficulty == DIFFICULTIES.MEDIUM){
                speedEnemyOne += mediumSpeed
            } else{
                speedEnemyOne += hardSpeed
            }
            score += 100
            xEnemyOne = parseInt($("#inimigo1").css("left"))
            yEnemyOne = parseInt($("#inimigo1").css("top"))

            explosion1(xEnemyOne, yEnemyOne)
            $("#disparo").css("left", 950)

            yPosition = parseInt(Math.random() * 334)
            $("#inimigo1").css("left", 694)
            $("#inimigo1").css("top", yPosition)
        }

        if (collision4.length > 0) {
            if(difficulty == DIFFICULTIES.EASY){
                speedEnemyTwo += easySpeed
            } else if(difficulty == DIFFICULTIES.MEDIUM){
                speedEnemyTwo += mediumSpeed
            } else{
                speedEnemyTwo += hardSpeed
            }
            score += 50
            xEnemyTwo = parseInt($("#inimigo2").css("left"))
            yEnemyTwo = parseInt($("#inimigo2").css("top"))
            $("#inimigo2").remove()

            explosion2(xEnemyTwo, yEnemyTwo)
            $("#disparo").css("left", 950)

            repositionEnemyTwo()
        }

        if (collision5.length > 0) {
            saved++
            rescueSound.play()
            repositionFriend()
            $("#amigo").remove()
        }

        if (collision6.length > 0) {
            lost++
            xFriend = parseInt($("#amigo").css("left"))
            yFriend = parseInt($("#amigo").css("top"))

            explosion3(xFriend, yFriend)
            $("#amigo").remove()
            repositionFriend()
        }
    }

    function explosion1(xEnemyOne, yEnemyOne) {
        explosionSound.play()
        $("#fundo-game").append("<div id='explosao1'></div")
        $("#explosao1").css("background-image", "url(assets/images/explosao.png)")
        var div = $("#explosao1")
        div.css("top", yEnemyOne)
        div.css("left", xEnemyOne)
        div.animate({
            width: 200,
            opacity: 0
        }, "slow")

        var explosionTime = window.setInterval(removeExplosion, 1000)

        function removeExplosion() {
            div.remove()
            window.clearInterval(explosionTime)
            explosionTime = null

        }
    }

    function repositionEnemyTwo() {
        var collisionTime4 = window.setInterval(reposition4, 5000)

        function reposition4() {
            window.clearInterval(collisionTime4)
            collisionTime4 = null

            if (endGame == false) {
                $("#fundo-game").append("<div id='inimigo2'></div")
            }
        }
    }

    function explosion2(xEnemyTwo, yEnemyTwo) {
        explosionSound.play()
        $("#fundo-game").append("<div id='explosao2'></div")
        $("#explosao2").css("background-image", "url(assets/images/explosao.png)")
        var div2 = $("#explosao2")
        div2.css("top", yEnemyTwo)
        div2.css("left", xEnemyTwo)
        div2.animate({
            width: 200,
            opacity: 0
        }, "slow")

        var explosionTime2 = window.setInterval(removeExplosion2, 1000)

        function removeExplosion2() {
            div2.remove()
            window.clearInterval(explosionTime2)
            explosionTime2 = null

        }
    }

    function repositionFriend() {
        var friendTime = window.setInterval(reposition6, 6000)

        function reposition6() {
            window.clearInterval(friendTime)
            friendTime = null

            if (endGame == false) {
                $("#fundo-game").append("<div id='amigo' class='animation3'></div")
            }
        }
    }

    function explosion3(xFriend, yFriend) {
        lostSound.play()
        $("#fundo-game").append("<div id='explosao3' class='animation4'></div")
        $("#explosao3").css("top", yFriend)
        $("#explosao3").css("left", xFriend)
        var explosionTime3 = window.setInterval(resetExplosion3, 1000)

        function resetExplosion3() {
            $("#explosao3").remove()
            window.clearInterval(explosionTime3)
            explosionTime3 = null
        }
    }

    function scoreboard() {
        $("#placar").html("<h2> Pontos: " + score + " Salvos: " + saved + " Perdidos: " + lost + "</h2>")
    }

    function energy() {
        if (currentEnergy == 3) {
            $("#energia").css("background-image", "url(assets/images/energia3.png)")
        } else if (currentEnergy == 2) {
            $("#energia").css("background-image", "url(assets/images/energia2.png)")
        } else if (currentEnergy == 1) {
            $("#energia").css("background-image", "url(assets/images/energia1.png)")
        } else {
            $("#energia").css("background-image", "url(assets/images/energia0.png)")
            gameOver()
        }
    }

    function gameOver(){
        endGame = true
        music.pause()
        gameOverSound.play()

        window.clearInterval(game.timer)
        game.timer = null

        $("#jogador").remove()
        $("#inimigo1").remove()
        $("#inimigo2").remove()
        $("#amigo").remove()

        $("#fundo-game").append("<div id='fim'</div>")
        $("#fim").html("<h1> Game Over </h1> <p>Sua pontuação foi: " + score + "</p>" + "<div id='reinicia' onClick=restartGame()><h3>Jogar Novamente</h3></div>")
    }

}

function restartGame(){
    gameOverSound.pause()
    $("#fim").remove()
    start()
}

$("#radio-group input:radio").on("change", function(){
    difficulty = $(this).val()
})

$("#button-start").on("click", start)