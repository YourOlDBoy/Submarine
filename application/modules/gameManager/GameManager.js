const BaseManager = require('../BaseManager');
const Game = require('./game/Game');

class GameManager extends BaseManager {
    constructor(options) {
        super(options);

        this.game = new Game({ 
            callbacks: { 
                // чтобы отдавалась только командирам
                refreshScene: scene => scene && this.io.local.emit(this.MESSAGES.UPDATE_SCENE, scene),
                // чтобы отдавалась всей команде
                getSubmarineCB: (gamer, submarine) => {
                    // взять по игроку пользователя
                    // и пользователю отдать его субмарину
                }
            } 
        });

        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.START_GAME, data => data && this.startGame(data, socket));
            socket.on(this.MESSAGES.END_GAME, data => data && this.endGame(data, socket));
            socket.on(this.MESSAGES.COMMAND_GAME, data => data && this.commandGame(data, socket));

            socket.on('disconnect', () => {
                // дропнуть морячка с субмарины
                //...
            });
        });
    }

    isCaptain(team, captainId) {
        return team.players.find(player => player.role == 'captain' && player.id === captainId);
    }

    startGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if (user) {
            const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if (team && this.isCaptain(team, user.id)) { // если капитан команды
                let roomId = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
                return this.io.in(roomId).emit(this.MESSAGES.START_GAME, true); // отправить сообщение о начале игры команде
            }
        }
        socket.emit(this.MESSAGES.START_GAME, false);
    }

    endGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if (user) {
            const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if (team) {
                if (this.isCaptain(team, user.id)) {
                    let roomId = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
                    this.io.in(roomId).emit(this.MESSAGES.END_GAME, true);
                    this.mediator.get(this.TRIGGERS.REMOVE_TEAM, data, socket);
                    return this.io.emit(this.MESSAGES.TEAM_LIST);
                }
                else {
                    socket.emit(this.MESSAGES.END_GAME, true);
                }
            }
        }   
        socket.emit(this.MESSAGES.END_GAME, false);
    }

    commandGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        const { command, options } = data;
        if (user && command) {
            const gamer = this.game.getGamer(user);
            return socket.emit(this.MESSAGES.COMMAND_GAME, this.game.command(gamer, command, options));
        }
        socket.emit(this.MESSAGES.COMMAND_GAME, false);
    }
}

module.exports = GameManager;