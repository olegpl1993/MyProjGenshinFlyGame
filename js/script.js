//адаптив и создание канваса
let cWidth = document.documentElement.clientWidth; //шырина екрана
let cHight = document.documentElement.clientHeight; //высота екрана
let mobileMod = false;

if (cWidth > 1000) {
    document.querySelector(".canvasBox").innerHTML = `<canvas id="canvas" width="1000px" height="${cHight - 52}px"></canvas>`;
}
else {
    document.querySelector(".canvasBox").innerHTML = `<canvas id="canvas" width="${cWidth}px" height="${cHight - 52}px"></canvas>`;
    mobileMod = true;
}

//----------------------------------
let cvs = document.getElementById("canvas"); //получаем канвас в переменную
let ctx = cvs.getContext("2d"); // определяем канвас 2Д

//переменные для картинок------------------
let flyr = new Image(); //персонаж
let flyr1 = new Image(); //персонаж
let flyr2 = new Image(); //персонаж
let bg = new Image(); //задний фон
let barrier = new Image(); //препятствие
let star = new Image(); //звезда
let mora = new Image(); //мора

if (mobileMod) { //подключение мобильных картинок
    flyr.src = "./img/Sfishel.png";
    flyr1.src = "./img/Sfishel1.png";
    flyr2.src = "./img/Sfishel2.png";
}
else { //подключение стандартных картинок
    flyr.src = "./img/Lfishel.png";
    flyr1.src = "./img/Lfishel1.png";
    flyr2.src = "./img/Lfishel2.png";
}
bg.src = "./img/bg.jpg";
barrier.src = "./img/bomb.png";
star.src = "./img/star.png";
mora.src = "./img/mora.png";

//------------------------------------------
let drawTimer; // таймер основного потока
let drawSpeed = 15; // скорость отрисовки потока
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
//управление персонажем---------------------------------
let st = 0; //определяет отрисовку персонажа движения 0 ровно, 1 вправо, 2 влево
let moveUp = false;  //направление движения персонажа
let moveRight = false; //направление движения персонажа
let moveDown = false; //направление движения персонажа
let moveLeft = false; //направление движения персонажа

function move() { //движение персонажа
    yPos += 1; //движение вниз (постоянное падение)

    if (moveUp == true && yPos > 0) { //проверка нажатой кнопки и размера игрового поля
        yPos -= 5; //скорость движение вперед
    }
    if (moveRight == true && xPos < gameWidth - flyr.width) { //проверка нажатой кнопки и размера игрового поля
        xPos += 8; //скорость движение вправо
        st = 1; //картинка для отрисовки вправо
    }
    if (moveDown == true && yPos < gameHeight - flyr.height) { //проверка нажатой кнопки и размера игрового поля
        yPos += 4; //скорость движение назад
    }
    if (moveLeft == true && xPos > 0) { //проверка нажатой кнопки и размера игрового поля
        xPos -= 8; //скорость движение влево
        st = 2; //картинка для отрисовки влево
    }
    if (moveRight == true && moveLeft == true) { //проверка зажатых двух кнопок
        st = 0; //возвращает стандарную картинку персонажа
    }
}
function moveStopUp() {
    moveUp = false;
}
function moveStopRight() {
    moveRight = false;
    st = 0; //возвращает стандарную картинку персонажа
}
function moveStopDown() {
    moveDown = false;
}
function moveStopLeft() {
    moveLeft = false;
    st = 0; //возвращает стандарную картинку персонажа
}
//------------------------------------------------------------------------

//экранное сенсорное управление-----------------------------------------------------------------------
document.querySelector(".canvasBox").addEventListener("touchstart", (e) => { //при нажатии на сенсор
    let x = e.changedTouches[0].clientX; //отслеживает координаты
    let y = e.changedTouches[0].clientY; //отслеживает координаты
    if (x < xPos) { //проверка направление движения
        moveLeft = true;
    }
    if (x > xPos + flyr.width) { //проверка направление движения
        moveRight = true;
    }
    if (y < yPos) { //проверка направление движения
        moveUp = true;
    }
    if (y > yPos + flyr.height) { //проверка направление движения
        moveDown = true;
    }
});
cvs.addEventListener("touchend", (e) => {  //при отпуске сенсора
    //сброс направления движения
    moveStopUp();
    moveStopRight();
    moveStopDown();
    moveStopLeft();
});
//-----------------------------------------------------------------------------

//управление клавиатура ------------------------------------------------------------------
document.addEventListener("keydown", function keyboarddown(e) { //срабатывает при наэатии кнопки
    switch (e.code) {  // проверка нажатой кнопки
        case "ArrowUp": //вверх
            moveUp = true;
            break;
        case "ArrowRight": //вправо
            moveRight = true;
            break;
        case "ArrowDown": //вниз
            moveDown = true;
            break;
        case "ArrowLeft": //влево
            moveLeft = true;
            break;
    }
});
document.addEventListener("keyup", function keyboarddown(e) { //срабатывает при отпускании кнопки
    switch (e.code) {  // проверка отпущеной кнопки
        case "ArrowUp": //вверх
            moveStopUp();
            break;
        case "ArrowRight": //вправо
            moveStopRight();
            break;
        case "ArrowDown": //вниз
            moveStopDown();
            break;
        case "ArrowLeft": //влево
            moveStopLeft();
            break;
    }
});
//--------------------------------------------------------------------------------------------

//отрисовка кадра (основная функция потока)-------------------------------------------
function draw() {
    //вызов функции движения персонажа
    move();
    //очистка фона
    ctx.clearRect(0, 0, cvs.width, cvs.height);
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
    if (st == 0) {
        ctx.drawImage(flyr, xPos, yPos); //картинка прямо
    }
    if (st == 1) {
        ctx.drawImage(flyr1, xPos, yPos); //картинка вправо
    }
    if (st == 2) {
        ctx.drawImage(flyr2, xPos, yPos); //картинка влево
    }
    //таймер потока----------------------------------------------------------------------------
    drawTimer = setTimeout(draw, drawSpeed);
    //проверка на столкновение и падение
    check();
}

//проверка на столкновение и падение-----------------------------------
function check() {
    //падение персонажа-----------
    if (yPos > gameHeight) {
        stopGame(); //остановка игры
    }
    //бомба----------------------------------------------
    //колизия модифицированная чтобы не зацеплять крыльями бомбу
    if (((xPos + flyr.width - 70 >= barriers.x) && (xPos + 70 <= barriers.x + barrier.width)) && ((yPos + flyr.height >= barriers.y) && (yPos + 20 <= barriers.y + barrier.height))) {
        //if (((xPos + flyr.width >= barriers.x) && (xPos <= barriers.x + barrier.width)) && ((yPos + flyr.height >= barriers.y) && (yPos <= barriers.y + barrier.height))) {
        stopGame(); //остановка игры
    }
    //звезда---------------
    if (((xPos + flyr.width >= stars.x) && (xPos <= stars.x + star.width)) && ((yPos + flyr.height >= stars.y) && (yPos <= stars.y + star.height))) { //стандартная колизия
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
    if (((xPos + flyr.width >= moras.x) && (xPos <= moras.x + mora.width)) && ((yPos + flyr.height >= moras.y) && (yPos <= moras.y + mora.height))) { //стандартная колизия
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
    //очистка фона
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    clearTimeout(drawTimer); //остановка потока
}

//старт игры-------------------------------
document.querySelector(".topRow__buttonStart").addEventListener("click", () => {
    //сбрасывает все переменные 
    stopGame();
    //стартовая позиция персонажа
    xPos = gameWidth / 2 - flyr.width * 0.5; //середина игрового поля
    yPos = gameHeight / 2; //низ игрового поля
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
