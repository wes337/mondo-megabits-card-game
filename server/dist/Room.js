"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(uuid, puppetMasters) {
        this.uuid = uuid;
        this.puppetMasters = puppetMasters;
        this.location = undefined;
        this.challenges = [];
        this.turn = {
            number: -1,
            player: undefined,
        };
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map