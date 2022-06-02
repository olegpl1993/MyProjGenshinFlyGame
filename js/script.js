let cvs = document.getElementById("canvas"); //получаем канвас в переменную
let ctx = cvs.getContext("2d"); // определяем канвас 2Д

//переменные для картинок------------------
let flyr = new Image(); //персонаж
let bg = new Image(); //задний фон
let barrier = new Image(); //препятствие
let star = new Image(); //звезда
let mora = new Image(); //мора

flyr.src = "./img/Lfishel.png";
bg.src = "./img/bg.jpg";
barrier.src = "./img/bomb.png";
star.src = "./img/star.png";
mora.src = "./img/mora.png";
//------------------------------------------
let drawTimer; // таймер основного потока
let drawSpeed = 10; // скорость отрисовки потока
//размер игрового поля
let gameWidth = document.getElementById('canvas').clientWidth;
let gameHeight = document.getElementById('canvas').clientHeight;
//позиция персонажа
let xPos;
let yPos;
//позицыя бомбы
let barriers = {};
//позицыя звезды
let stars = {};
let qStars; //количество собраных звезд
//позицыя моры
let moras = {};
let qmora; //количество собраной моры
//скорость падения бомбы
let bombSpeed;
//------------------------------------------------------------------------------------------------------------------

//управление персонажем-------------------------
document.addEventListener("keydown", (e) => {
    switch (e.code) {  // проверка нажатой кнопки
        case "ArrowUp": //вверх
            if (yPos > 0) { //проверка размера игрового поля
                yPos -= 20;
            }
            break;
        case "ArrowRight": //вправо
            if (xPos < gameWidth - flyr.width) { //проверка размера игрового поля
                xPos += 20;
            }
            break;
        case "ArrowDown": //вниз
            if (yPos < gameHeight - flyr.height) { //проверка размера игрового поля
                yPos += 20;
            }
            break;
        case "ArrowLeft": //влево
            if (xPos > 0) { //проверка размера игрового поля
                xPos -= 20;
            }
            break;
    }
});
//----------------------------------------------------------------------------------------------

//отрисовка кадра (основная функция потока)-------------------------------------------
function draw() {
    //отрисовка фона
    ctx.drawImage(bg, 0, 0);

    //бомба-------------------------------------------------------------------------------
    ctx.drawImage(barrier, barriers.x, barriers.y); // отрисовка бомбы
    barriers.y += bombSpeed; //движение бомбы
    //перемещает препятствие на стартовую позицию
    if (barriers.y > gameHeight) { //если покидает пределы игрового поля
        barriers = {
            x: Math.floor(Math.random() * (gameWidth - barrier.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
            y: -100
        };
    }

    //звезда------------------------------------------------------------------------------------
    ctx.drawImage(star, stars.x, stars.y); //отрисовка звезды
    stars.y += 3; //движение звезды, больеше - быстрее
    //перемещает звезду на стартовую позицию
    if (stars.y > gameHeight) { //если покидает пределы игрового поля
        stars = {
            x: Math.floor(Math.random() * (gameWidth - star.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
            y: -2000
        };
    }
    //мора------------------------------------------------------------------------------------
    ctx.drawImage(mora, moras.x, moras.y); //отрисовка моры
    moras.y += 3; //движение, больеше - быстрее
    //перемещает на стартовую позицию
    if (moras.y > gameHeight) { //если покидает пределы игрового поля
        moras = {
            x: Math.floor(Math.random() * (gameWidth - mora.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
            y: -200
        };
    }
    //персонаж-----------------------------------------------------------------------------------
    ctx.drawImage(flyr, xPos, yPos);
    //таймер потока
    drawTimer = setTimeout(draw, drawSpeed);
    //проверка на столкновение
    check();
}

//проверка на столкновение-----------------------------------
function check() {
    //бомба----------------
    if (((xPos + flyr.width >= barriers.x) && (xPos <= barriers.x + barrier.width)) && ((yPos + flyr.height >= barriers.y) && (yPos <= barriers.y + barrier.height))) {
        stopGame(); //остановка игры
    }
    //звезда---------------
    if (((xPos + flyr.width >= stars.x) && (xPos <= stars.x + star.width)) && ((yPos + flyr.height >= stars.y) && (yPos <= stars.y + star.height))) {
        qStars++; //прибавляет количество собранных звезд
        bombSpeed++; //Увеличивает скорость бомбы
        document.querySelector(".topRow__qStar").textContent = qStars; //выводит количество звезд 
        //перемещает звезду на стартовую позицию
        stars = {
            x: Math.floor(Math.random() * (gameWidth - star.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
            y: -2000
        };
    }
    //мора---------------
    if (((xPos + flyr.width >= moras.x) && (xPos <= moras.x + mora.width)) && ((yPos + flyr.height >= moras.y) && (yPos <= moras.y + mora.height))) {
        qmora++; //прибавляет количество собранных звезд
        document.querySelector(".topRow__qMora").textContent = qmora; //выводит количество моры
        //перемещает мору на стартовую позицию
        moras = {
            x: Math.floor(Math.random() * (gameWidth - mora.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
            y: -200
        };
    }
}

//Остановка игры------------------------------------
function stopGame() {
    ctx.drawImage(bg, 0, 0);//очистка поля 
    clearTimeout(drawTimer); //остановка потока
}

//старт игры-------------------------------
document.querySelector(".topRow__buttonStart").addEventListener("click", () => {
    //сбрасывает все переменные 
    stopGame();
    //стартовая позиция персонажа
    xPos = gameWidth / 2 - 0, 5 * flyr.width; //середина игрового поля
    yPos = gameHeight - flyr.height; //низ игрового поля
    //позицыя бомбы
    barriers = {
        x: Math.floor(Math.random() * (gameWidth - barrier.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -200
    };
    //позицыя звезды
    stars = {
        x: Math.floor(Math.random() * (gameWidth - star.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -2000
    };
    qStars = 0; //количество собраных звезд
    //позицыя моры
    moras = {
        x: Math.floor(Math.random() * (gameWidth - mora.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -300
    };
    qmora = 0; //количество собраной моры
    //скорость падения бомбы
    bombSpeed = 1;
    //------------------------------------
    document.querySelector(".topRow__qStar").textContent = qStars; //выводит количество звезд 
    document.querySelector(".topRow__qMora").textContent = qmora; //выводит количество моры

    draw(); //запускает поток игры
});
