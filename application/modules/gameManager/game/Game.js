const CONFIG = require('./config');
const Submarine = require('./entities/Submaine');

class Game {
    constructor({ callbacks = {} }) {
        const { COMMANDS, TIMEUPDATE, SCENEUPDATE } = CONFIG;
        this.COMMANDS = COMMANDS;
        this.TIMEUPDATE = TIMEUPDATE;
        this.submarines = {}; // ключ - идентификатор командира
        this.map;
        this.ships = {};
        this.timestamp = (new Date()).getTime(); // общеигровое время
        // коллбеки
        this.refreshScene = callbacks.refreshScene instanceof Function ? callbacks.refreshScene(this.getScene()) : () => {};
        this.getSubmarineCB = (callbacks.getSubmarineCB instanceof Function)
            ? gamer => callbacks.getSubmarineCB(gamer, this.getSubmarine(gamer))
            : () => {};
        this.delSubmarine = callbacks.delSubmarine instanceof Function ? id => callbacks.delSubmarine(id) : () => {};
        this.delSailor = callbacks.delSailor instanceof Function ? (subId, SailorId) => callbacks.delSailor(subId, SailorId) : () => {};

        // общий старт игры
        setInterval(() => this.updateScene(), SCENEUPDATE);
    }

    // добавить новую субмарину
    addSubmarine(options) {
        //...
        this.refreshScene();
    }

    // удалить субмарину (она или померла, или капитан включил истеричку и вышел)
    delSubmarine(id) {
        //...
        this.refreshScene();
    }

    // удалить морячка из субмарины
    delSailor(subId, SailorId) {
        //...
    }

    // среди субмарин найти игрока по id пользователя
    getGamer(user) {
        //...
    }

    // взять субмарину игрока
    getSubmarine(gamer) {

    }

    move(submarine, gamer, direction) {
        if (submarine && gamer) {
            //...
            return true;
        }
        return false;
    }

    // какая-либо команда игрока
    command(gamer, command, options) {
        switch (command) {
            case this.COMMANDS.MOVE_LEFT: return this.move(this.getSubmarine(gamer), gamer, 'left');
            case this.COMMANDS.MOVE_RIGHT: return this.move(this.getSubmarine(gamer), gamer, 'right');
            case this.COMMANDS.MOVE_UP: return this.move(this.getSubmarine(gamer), gamer, 'up');
            case this.COMMANDS.MOVE_DOWN: return this.move(this.getSubmarine(gamer), gamer, 'down');
            //...
        }
        // 2. проверить, что название команды корректное
        // 3. проверить, что параметры команды релевантные
        // 4. выполнить команду
        //...
        return false;
    }

    getScene() {
        const timestamp = (new Date()).getTime();
        if (timestamp - this.timestamp >= this.TIMEUPDATE) {
            this.timestamp = timestamp;
            // набрать субмарины
            const submarines = [];
            for (let key in this.submarines) {
                submarines.push(this.submarines[key].get());
            }
            return {
                submarines,
                map: this.map,
                ships: this.ships
            };
        }
    }

    // обновить игровой мир
    updateScene() {
        let canRefresh = false;
        // изменить параметры оборудования
        // переместить игроков (по желанию)
        // изменяем характеристики субмарины по её оборудованию 
        // переместить торпеды
        // нанести повреждения
        // утопить субмарину
        // убить погибших игроков

        // вызывать не всегда, а только в том случае, если сцена действительно изменилась
        if (canRefresh) {

            // пробежаться по всем субмаринам
                // пробежаться по каждому члену команды субмарины
                // и для каждого члена команды субмарины вызвать this.getSubmarineCB(gamer);

            this.refreshScene();
        }
    }
}

module.exports = Game;