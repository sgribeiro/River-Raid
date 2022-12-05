
function newElement(tagName, id) {
    const element = document.createElement(tagName)
    element.setAttribute('id', id)
    return element
}

function Ship(gameWidth, gameHeight) {
    //Variáveis de movimentação da nave
    let moving = false
    let movingDirection = ''
    //Adicionando a nave
    this.element = newElement('img', 'ship')
    this.element.src = 'img/ship.png'
    //Funções de posição da nave na tela
    this.getX = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setX = x => this.element.style.bottom = `${x}px`
    this.getY = () => parseInt(this.element.style.left.split('px')[0])
    this.setY = y => this.element.style.left = `${y}px`
    //Pressionamento ou não de teclas
    window.onkeydown = function (event){
        keys = ['W','A','S','D']
        movingDirection = String.fromCharCode(event.keyCode)

        if(keys.includes(movingDirection))
            moving = true
    }

    window.onkeyup = function (event){
        moving = false
    }

    this.motion = () => {
        var newPosition = ''
        const gameHeightMax = gameHeight - (this.element.clientWidth - 3)
        const gameWidthtMax = gameWidth - (this.element.clientWidth - 3)

        switch (movingDirection) {
            case 'W':
                newPosition = this.getX() + (moving ? 6 : 0)
                break
            case 'A':
                newPosition = this.getY() - (moving ? 6 : 0)
                break
            case 'S':
                newPosition = this.getX() - (moving ? 6 : 0)
                break
            case 'D':
                newPosition = this.getY() + (moving ? 6 : 0)
                break
        }

        if((movingDirection == 'W') || (movingDirection == 'S')){
            if (newPosition <= 0)
                this.setX(0)
            else if (newPosition >= gameHeightMax)
                this.setX(gameHeightMax)
            else
                this.setX(newPosition)
        }else if ((movingDirection == 'A') || (movingDirection == 'D')){
            if (newPosition <= 0) {
                this.setY(0)
            } else if (newPosition >= gameWidthtMax) {
                this.setY(gameWidthtMax)
            } else {
                this.setY(newPosition)
            }
        }
    }

    this.setX(10)
    this.setY((gameWidth/2) - 30)
}

function Barrier() {
    this.element = newElement('div', 'ground')

    //Função para modificar o tamanho da barreira
    this.setWidth = width => this.element.style.width = `${width}px`
}

function Fuel() {
    this.element = newElement('div', 'fuel')

    this.fuel = newElement('img', 'fuel')
    this.fuel.src = 'img/fuel.png'

    this.element.appendChild(this.fuel)
}

function Point() {
    this.element = newElement('div', 'point')

    this.point = newElement('img', 'point')
    this.point.src = 'img/botton.png'

    this.element.appendChild(this.point)
}

function BarrierN(width, openingFixed, ground, optionChange, screenPosition) {
    //Criando as barreiras
    this.element = newElement('div', 'barrier-config')
    
    this.left = new Barrier()
    this.middle = new Barrier()
    this.right = new Barrier()

    this.fuel = new Fuel()
    this.point = new Point()

    this.duo = (option) =>{
        //Adicionando as barreiras no elemento que foi criado
        this.element.appendChild(this.left.element)
        this.element.appendChild(this.right.element)

        //Calculando o tamanho de cada elemento
        leftWidth = option * (width - openingFixed)
        rightWidth = width - openingFixed - leftWidth

        //Definindo o tamanho de cada elemento (anteriormente calculado)
        this.right.setWidth(leftWidth)
        this.left.setWidth(rightWidth)
    }
    
    this.trio = (option) =>{
        //Calculando o tamanho de cada elemento
        middleWidth = option * (width - openingFixed * 2)
        rightWidth = (width - (middleWidth + openingFixed * 2))/2
        leftWidth = (width - (middleWidth + openingFixed * 2))/2
    
        //Adicionando as barreiras no elemento que foi criado
        this.element.appendChild(this.left.element)
        if(middleWidth > 0)
            this.element.appendChild(this.middle.element)

        this.element.appendChild(this.right.element)

        //Definindo o tamanho de cada elemento (anteriormente calculado)
        this.right.setWidth(rightWidth)
        if(middleWidth > 0)
            this.middle.setWidth(middleWidth)

        this.left.setWidth(leftWidth)
    }

    this.zigZag = (option) =>{
        //Adicionando as barreiras no elemento que foi criado
        this.element.appendChild(this.left.element)
        this.element.appendChild(this.right.element)

        if(option >= .5){
            //Calculando o tamanho de cada elemento
            leftWidth = option * (width - openingFixed)
            rightWidth = .5 * (width - openingFixed)
        }
        else{
            rightWidth = (.5 + option) * (width - openingFixed)
            leftWidth = .5 * (width - openingFixed)
        }

        //Definindo o tamanho de cada elemento (anteriormente calculado)
        this.right.setWidth(leftWidth)
        this.left.setWidth(rightWidth)
    }

    this.points = (option) =>{
        //Adicionando as barreiras no elemento que foi criado
        this.element.appendChild(this.left.element)
        if(option == 1){
            this.element.appendChild(this.fuel.element)
            this.element.appendChild(this.point.element)
        }

        this.element.appendChild(this.right.element)

        //Calculando o tamanho de cada elemento
        leftWidth = .3 * (width - (openingFixed * 2))
        rightWidth = leftWidth

        //Definindo o tamanho de cada elemento (anteriormente calculado)
        this.right.setWidth(leftWidth)
        this.left.setWidth(rightWidth)
    }

    //Definindo as configurações dos obstaculos
    this.openingChange = (ground, option) => {
        if(ground == 'duo')
            this.duo(option)
        else if(ground == 'trio')
            this.trio(option)
        else if(ground == 'zigZag')
            this.zigZag(option)
        else if(ground == 'points')
            this.points(option)
    }

    //Funções de posição (em relação ao bottom da tela do jogo) das barreiras na tela
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = screenPosition => this.element.style.bottom = `${screenPosition}px`

    this.getHeight = () => this.element.clientHeight

    this.openingChange(ground, optionChange)
    this.setY(screenPosition)
}

let position = -1

function frontFree(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position)
    ]

    return scenery
}

function rightFree(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'duo', .6, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .4, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .3, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .2, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .1, height + 100 * ++position)
    ]

    return scenery
}

function leftFree(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'duo', .0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .1, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .2, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .3, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .4, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'duo', .5, height + 100 * ++position)
    ]

    return scenery
}

function zigZag(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'zigZag', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'zigZag', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'zigZag', .7, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'zigZag', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'zigZag', .5, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'zigZag', .2, height + 100 * ++position)
    ]

    return scenery
}

function rightAndLeftFreeBottom(width, openingFixed,  height){
    scenery = [
        new BarrierN(width, openingFixed, 'trio', 0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .2, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .4, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .6, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .8, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', 1, height + 100 * ++position)
    ]

    return scenery
}

function rightAndLeftFreeTop(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'trio', 1, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .8, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .6, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .4, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', .2, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'trio', 0, height + 100 * ++position)
    ]

    return scenery
}

function frontFreePoints(width, openingFixed, height){
    scenery = [
        new BarrierN(width, openingFixed, 'points', 0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'points', 0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'points', 0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'points', 1, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'points', 0, height + 100 * ++position),
        new BarrierN(width, openingFixed, 'points', 0, height + 100 * ++position)
    ]

    return scenery
}

function Barriers(height, width, openingFixed, notificarPonto) {
    //Spread (...)
    this.ground = [...rightFree(width, openingFixed, height),
                   ...leftFree(width, openingFixed, height),
                   ...rightAndLeftFreeBottom(width, openingFixed, height),
                   ...rightAndLeftFreeTop(width, openingFixed, height),
                   ...zigZag(width, openingFixed, height),
                   ...frontFree(width, openingFixed, height),
                   ...frontFreePoints(width, openingFixed, height)]

    const displacementSpeed = 5
    let pass = 0

    this.motion = () => {
        this.ground.forEach(
            pair => {
                pair.setY(pair.getY() - displacementSpeed)

                if (pair.getY() < -pair.getHeight())
                    pair.setY(pair.getY() + 100 * this.ground.length)

                //Pontuacao
                if ((pair.getY() >= -1) && (pair.getY() <= 0)) {
                    pass = pass + 1

                    if((pass % 6) == 0)
                        notificarPonto()
                }
            })
    }
}

function Progress() {
    this.pointsUpdate = points => {
        document.getElementById('points').innerHTML = points
    }

    this.pointsUpdate(0)
}

function FuelBar() {
    this.lostingFuel = fuel => {
        element = document.getElementById('fuel-bar')

        element.style.width = `${fuel}%`
    }

    this.lostingFuel(100)
}

function GameOver(){
    element = document.getElementById('game-over')
    element.style.display = 'block'    
}

function overlap(AElement, BElement) {

    const a = AElement.getBoundingClientRect()
    const b = BElement.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function collide(ship, barriers) {
    let checkGround = false
    let checkFuel = false
    let checkPoint = false

    barriers.ground.forEach(pair => {
        if (!checkGround) {
            const left = pair.left.element
            const middle = pair.middle.element
            const right = pair.right.element
        
            checkGround = overlap(ship.element, left) || overlap(ship.element, middle) || overlap(ship.element, right)
        }

        if (!checkFuel) {
            const fuel = pair.fuel.element
            pair.fuel.element.style.display = 'block'

            checkFuel = overlap(ship.element, fuel)

            if (checkFuel)
                pair.fuel.element.style.display = 'none'
        }

        if (!checkPoint) {
            const point = pair.point.element
            pair.point.element.style.display = 'block'

            checkPoint = overlap(ship.element, point)
         
            if (checkPoint)
                pair.point.element.style.display = 'none'
        }
    })

    console.log(checkFuel)

    return [checkGround, checkFuel, checkPoint]
}

function RiverRaid() {
    //Armazenar a pontuação feita pelo jogador.
    let points = 0
    var fuelPoints = 100
    //Medidas da tela do jogo.
    const gameScreen = document.querySelector('[game-screen]')
    const gameHeight = gameScreen.clientHeight
    const gameWidth = gameScreen.clientWidth
    //Criando a nave, o progresso e as barreiras do jogo
    const ship = new Ship(gameWidth, gameHeight)
    const progress = new Progress()
    const fuelBar = new FuelBar()
    const barriers = new Barriers(gameHeight, gameWidth, 300, () => progress.pointsUpdate(++points))
    //Inserindo a nave e as barriers na tela de jogo
    gameScreen.appendChild(ship.element)
    //barriers.pairs.forEach(pair => gameScreen.appendChild(pair.element))
    barriers.ground.forEach(pair => gameScreen.appendChild(pair.element))

    this.start = () => {
        let milliseconds = 0
        const timer = setInterval(() => {
            milliseconds = milliseconds + 20

            barriers.motion()
            ship.motion()

            checks = collide(ship, barriers)

            checkGround = checks[0]
            checkFuel = checks[1]
            checkPoint = checks[2]

            if(checkGround){
                 clearInterval(timer)
                 GameOver()
            }

            if(checkFuel)
                fuelPoints = fuelPoints + 1

            if(checkPoint)
                points = points + 1

            //1 segundo == 1000 milisegundos
            if ((milliseconds % 1000) == 0){
                //A cada 1 segundo a nave perde 2 pontos de gasolina
                fuelPoints = fuelPoints - 2
                fuelBar.lostingFuel(fuelPoints)
                //Se os pontos de gasolina chegarem a 0 o jogo termina
                if(fuelPoints <=0){
                    clearInterval(timer)
                    GameOver()
               }
            }

        }, 20)
    }
}

//Iniciando o Jogo
new RiverRaid().start()
