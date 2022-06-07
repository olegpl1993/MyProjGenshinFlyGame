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
let bgMond = new Image(); //фон для 1 уровня
let bgLiue = new Image(); //фон для 2 уровня
let bgInad = new Image(); //фон для 3 уровня
let barrier = new Image(); //препятствие
let star = new Image(); //звезда
let mora = new Image(); //мора
let fischl = new Image(); //победная картинка

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
bgMond.src = "./img/bgMond.jpg";
bgLiue.src = "./img/bgLiue.jpg";
bgInad.src = "./img/bgInad.jpg";
barrier.src = "./img/barier.png";
star.src = "./img/star.png";
mora.src = "./img/mora.png";
fischl.src = "./img/fischl.png";

//------------------------------------------
let lvl; //игровой уровень
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
//скорость падения препятствия
let bombSpeed;
//управление персонажем
let st = 0; //определяет отрисовку персонажа движения 0 ровно, 1 вправо, 2 влево
let moveUp = false;  //направление движения персонажа
let moveRight = false; //направление движения персонажа
let moveDown = false; //направление движения персонажа
let moveLeft = false; //направление движения персонажа

//движение персонажа----------------------------------------------------
function move() {
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
    if (x < xPos + flyr.width / 2 && y > yPos && y < yPos + flyr.height) { //проверка направление движения
        moveLeft = true;
    }
    if (x > xPos + flyr.width / 2 && y > yPos && y < yPos + flyr.height) { //проверка направление движения
        moveRight = true;
    }
    if (y < yPos && x > xPos && x < xPos + flyr.width) { //проверка направление движения
        moveUp = true;
    }
    if (y > yPos + flyr.height && x > xPos && x < xPos + flyr.width) { //проверка направление движения
        moveDown = true;
    }
    if (x < xPos && y < yPos) { //проверка направление движения
        moveLeft = true;
        moveUp = true;
    }
    if (x > xPos + flyr.width && y < yPos) { //проверка направление движения
        moveRight = true;
        moveUp = true;
    }
    if (y > yPos + flyr.height && x < xPos) { //проверка направление движения
        moveDown = true;
        moveLeft = true;
    }
    if (y > yPos + flyr.height && x > xPos + flyr.width) { //проверка направление движения
        moveDown = true;
        moveRight = true;
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
document.addEventListener("keydown", function keyboarddown(e) { //срабатывает при нажатии кнопки
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

//отрисовка текста в потоке игры --------------------------------------------------------------------------------
let fvisible; //0 текста нету, 1 текст есть
function drawText() {
    if (lvl == 1 && fvisible == 1) { //начало 1 уровня
        ctx.fillStyle = 'white';
        ctx.font = `20px Verdana`;
        ctx.fillText("Level 1", gameWidth / 2 - 40, gameHeight / 2 - 50);
        ctx.font = `48px Verdana`;
        ctx.fillText("Mondstadt", gameWidth / 2 - 135, gameHeight / 2);
        setTimeout(() => { fvisible = 0; }, 3000); //отключает текст через 3 секунд
    }
    else if (lvl == 2 && fvisible == 1) { //начало 2 уровня
        ctx.fillStyle = 'white';
        ctx.font = `20px Verdana`;
        ctx.fillText("Level 2", gameWidth / 2 - 40, gameHeight / 2 - 50);
        ctx.font = `48px Verdana`;
        ctx.fillText("Liyue", gameWidth / 2 - 70, gameHeight / 2);
        setTimeout(() => { fvisible = 0; }, 3000); //отключает текст через 3 секунд
    }
    else if (lvl == 3 && fvisible == 1) { //начало 3 уровня
        ctx.fillStyle = 'white';
        ctx.font = `20px Verdana`;
        ctx.fillText("Level 3", gameWidth / 2 - 40, gameHeight / 2 - 50);
        ctx.font = `48px Verdana`;
        ctx.fillText("Inazuma", gameWidth / 2 - 110, gameHeight / 2);
        setTimeout(() => { fvisible = 0; }, 3000); //отключает текст через 3 секунд
    }
}

//отрисовка кадра (основная функция потока)-------------------------------------------
function draw() {
    //отрисовка фона
    if (lvl == 1) ctx.drawImage(bgMond, 0, 0);
    if (lvl == 2) ctx.drawImage(bgLiue, 0, 0);
    if (lvl == 3) ctx.drawImage(bgInad, 0, 0);
    //отрисовка текста
    drawText();
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
    //таймер потока (рекурсия основной функции игры) ------------------------------------
    drawTimer = setTimeout(draw, drawSpeed);
    //проверка на столкновение и падение
    check();
    //вызов функции движения персонажа
    move();
}

//проверка на игровые события (столкновение, падение, пробеду) -----------------------------------
function check() {
    //проверка количества собранных звезд
    if (qStars == 5) {
        win();
    }
    //падение персонажа-----------
    if (yPos > gameHeight) {
        stopGame(); //остановка игры
    }
    //проверки на столкновения с предметами ---------------------------------------------
    //бомба (колизия модифицированная чтобы не зацепить крыльями бомбу)
    if (((xPos + flyr.width - 70 >= barriers.x) && (xPos + 70 <= barriers.x + barrier.width)) && ((yPos + flyr.height >= barriers.y) && (yPos + 20 <= barriers.y + barrier.height))) {
        //if (((xPos + flyr.width >= barriers.x) && (xPos <= barriers.x + barrier.width)) && ((yPos + flyr.height >= barriers.y) && (yPos <= barriers.y + barrier.height))) {
        stopGame(); //конец игры
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
//--------------------------------------------------------------------------------------------------------------------

//конец игры ------------------------------------
function stopGame() {
    clearTimeout(drawTimer); //остановка основного потока игры
    //отрисовка фона
    if (lvl == 1) ctx.drawImage(bgMond, 0, 0);
    if (lvl == 2) ctx.drawImage(bgLiue, 0, 0);
    if (lvl == 3) ctx.drawImage(bgInad, 0, 0);
    //текст конец игры проиграл
    ctx.fillStyle = 'red';
    ctx.font = `48px Verdana`;
    ctx.fillText("GAME OVER", gameWidth / 2 - 140, gameHeight / 2);
    //очистка фона через 1.5 сек после конца игры
    setTimeout(() => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        document.querySelector(".topRow__buttonStart").style.display = "block"; //возвращает кнопку старт
        qmora = 0; //обнуляет количество собраной моры
        qStars = 0; //обнуляет количество собраных звезд
        document.querySelector(".topRow__qStar").textContent = qStars; //выводит количество звезд 
        document.querySelector(".topRow__qMora").textContent = qmora; //выводит количество моры
        document.querySelector(".star__box").innerHTML = `<img class="topRow__star" src="img/star.png" alt="star">`; //анемокул в строке
    }, 1500);
}

//победа, уровень пройден--------------------------------
function win() {
    clearTimeout(drawTimer); //остановка основного потока игры
    //установка стартовых параметров нового уровня -------------------
    //стартовая позиция персонажа
    xPos = gameWidth / 2 - flyr.width * 0.5; //середина игрового поля
    yPos = gameHeight / 2; //низ игрового поля
    barriers = { //позицыя бомбы
        x: Math.floor(Math.random() * (gameWidth - barrier.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -200
    };
    stars = { //позицыя звезды
        x: Math.floor(Math.random() * (gameWidth - star.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -2000
    };
    moras = { //позицыя моры
        x: Math.floor(Math.random() * (gameWidth - mora.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -300
    };
    qStars = 0; //обнуляет количество собраных звезд
    document.querySelector(".topRow__qStar").textContent = qStars; //выводит количество звезд
    fvisible = 1; //включает отрисовку текста в начале уровня

    if (lvl == 1) { //конец текущего уровня-----------------
        ctx.drawImage(bgMond, 0, 0); //отрисовка фона (очистка)
        // текст уровень пройден
        ctx.fillStyle = 'rgb(0, 255, 17)';
        ctx.font = `35px Verdana`;
        ctx.fillText("Level complete", gameWidth / 2 - 130, gameHeight / 2);
        lvl = 2; //повышение уровня
        bombSpeed = 5; //скорость падения бомбы
        barrier.src = "./img/barier1.png"; //меняет препятствие
        star.src = "./img/star1.png"; //меняет звезду
        document.querySelector(".star__box").innerHTML = `<img class="topRow__star" src="img/star1.png" alt="star">`; //геокул в строке
        setTimeout(draw, 1500); //начало нового потока игры
    }
    else if (lvl == 2) { //конец текущего уровня-----------------
        ctx.drawImage(bgLiue, 0, 0); //отрисовка фона (очистка)
        // текст уровень пройден
        ctx.fillStyle = 'rgb(0, 255, 17)';
        ctx.font = `35px Verdana`;
        ctx.fillText("Level complete", gameWidth / 2 - 130, gameHeight / 2);
        //установка стартовых параметров нового уровня -------------------
        lvl = 3; //повышение уровня
        bombSpeed = 10; //скорость падения бомбы
        barrier.src = "./img/barier2.png";  //меняет препятствие
        star.src = "./img/star2.png"; //меняет звезду
        document.querySelector(".star__box").innerHTML = `<img class="topRow__star" src="img/star2.png" alt="star">`; //електрокул в строке
        setTimeout(draw, 1500); //начало нового потока игры
    }
    else { //конец игры (победа) -----------------
        ctx.drawImage(bgInad, 0, 0); //отрисовка фона (очистка)
        ctx.drawImage(fischl, gameWidth / 2 - fischl.width / 2,  gameHeight / 2 - fischl.height / 2); //победаная картинка
        // текст победа
        ctx.fillStyle = 'rgb(247, 95, 255)';
        ctx.font = `46px Verdana`;
        ctx.fillText("YOU WIN", gameWidth / 2 - 110, gameHeight / 2 - fischl.height / 2);
        document.querySelector(".topRow__buttonStart").style.display = "block"; //возвращает кнопку старт
    }
}

//старт игры, сбрасывает все переменные на начальные -------------------------
document.querySelector(".topRow__buttonStart").addEventListener("click", () => {
    clearTimeout(drawTimer); //остановка основного потока игры
    //отрисовка фона
    if (lvl == 1) ctx.drawImage(bgMond, 0, 0);
    if (lvl == 2) ctx.drawImage(bgLiue, 0, 0);
    if (lvl == 3) ctx.drawImage(bgInad, 0, 0);
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
    //позицыя моры
    moras = {
        x: Math.floor(Math.random() * (gameWidth - mora.width)), //случайное число от 0 до (шырина поля - ширина обьекта)
        y: -300
    };
    lvl = 1; // сброс уровеня игры
    fvisible = 1; //включает отрисовку текста в начале уровня
    bombSpeed = 1; //скорость падения бомбы
    qmora = 0; //обнуляет количество собраной моры
    qStars = 0; //обнуляет количество собраных звезд
    barrier.src = "./img/barier.png"; //меняет препятствие на стандартное
    star.src = "./img/star.png"; //меняет звезду на стандартную
    document.querySelector(".star__box").innerHTML = `<img class="topRow__star" src="img/star.png" alt="star">`; //анемокул в строке
    //------------------------------------
    document.querySelector(".topRow__qStar").textContent = qStars; //выводит количество звезд 
    document.querySelector(".topRow__qMora").textContent = qmora; //выводит количество моры
    document.querySelector(".topRow__buttonStart").style.display = "none"; //убирает кнопку старт после начала игры

    draw(); //запускает поток игры
});
