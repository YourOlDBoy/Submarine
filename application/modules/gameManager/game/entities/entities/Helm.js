class Helm extends Equipment {
    constructor(options = {}) {
        options.type = 'Helm';
        super(options);
        options.params = { 
            rudder: 0, // положение руля
            aileron: 0, // положение рулей высоты
        };
    }
}
module.exports = Helm;