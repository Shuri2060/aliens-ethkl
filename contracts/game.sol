// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract AliensGame {
    uint8 public maxHp;
    uint8 public maxArmor;
    uint8 public minPunch;
    uint8 public maxPunch;
    uint8 public minKick;
    uint8 public maxKick;
    uint8 public fallPercent;
    uint8 public minFall;
    uint8 public maxFall;
    uint8 public minDefend;
    uint8 public maxDefend;
    uint8 public defaultDmg;

    mapping(address => mapping(address => uint8)) public hps;
    mapping(address => mapping(address => uint8)) public armors;
    mapping(address => mapping(address => bool)) public isTurns;

    // event Start(address indexed user, uint256 amountE18, bool outcome);
    // event End(address indexed user, uint256 amountE18, bool outcome);
    // event Action(address indexed user, uint256 amountE18, bool outcome);
    // event HP(address indexed changed, address indexed opponent, uint256 amountE18, bool outcome);

    // TODO crit, fall %

    // 3 - 25 punch
    // 26 - 38 punch crit 12.5%
    // 3 - 10 armor
    // 11 - 15 armor crit 7.5%

    constructor(
        uint8 _maxHp, // 100
        uint8 _maxArmor, // 30
        uint8 _minPunch, // 3
        uint8 _maxPunch, // 25
        uint8 _minKick, // 10
        uint8 _maxKick, // 38
        uint8 _fallPercent, // 20
        uint8 _minFall, // 5
        uint8 _maxFall, // 19
        uint8 _minDefend, // 3
        uint8 _maxDefend, // 15
        uint8 _defaultDmg // 5
    ) {
        maxHp = _maxHp;
        maxArmor = _maxArmor; // require _maxArmor + _maxDefend <= 255
        minPunch = _minPunch;
        maxPunch = _maxPunch;
        minKick = _minKick;
        maxKick = _maxKick;
        fallPercent = _fallPercent;
        minFall = _minFall;
        maxFall = _maxFall;
        minDefend = _minDefend;
        maxDefend = _maxDefend;
        defaultDmg = _defaultDmg;
    }

    function ready(address opponent) external {
        if (hps[msg.sender][opponent] == 0 || hps[opponent][msg.sender] == 0) {
            if (isTurns[opponent][msg.sender]) {
                // start
                // choose first
                bool isFirst = dice(0, 1) == 0;
                isTurns[msg.sender][opponent] = isFirst;
                isTurns[opponent][msg.sender] = !isFirst;

                hps[msg.sender][opponent] = maxHp;
                hps[opponent][msg.sender] = maxHp;
            } else {
                // ready
                isTurns[msg.sender][opponent] = true;
            }
        }
    }

    function action(
        address opponent,
        bool isPunchOrKick,
        bool isPunchOrDefend
    ) external {
        if (isTurns[msg.sender][opponent]) {
            isTurns[msg.sender][opponent] = false;
            if (isPunchOrKick) {
                if (isPunchOrDefend) {
                    // Punch
                    uint8 dmg = dice(minPunch, maxPunch);
                    if (dmg < armors[opponent][msg.sender]) {
                        // default dmg
                        dmg = defaultDmg;
                    } else {
                        // armored
                        dmg -= armors[opponent][msg.sender];
                    }
                    if (dmg >= hps[opponent][msg.sender]) {
                        // dead
                        hps[opponent][msg.sender] = 0;
                        armors[msg.sender][opponent] = 0;
                        armors[opponent][msg.sender] = 0;
                    } else {
                        // alive
                        hps[opponent][msg.sender] -= dmg;
                        isTurns[opponent][msg.sender] = true;
                    }
                } else {
                    if (dice(0, 99) < fallPercent) {
                        // Fall
                        uint8 dmg = dice(minFall, maxFall);
                        if (dmg < armors[msg.sender][opponent]) {
                            // default dmg
                            dmg = defaultDmg;
                        } else {
                            // armored
                            dmg -= armors[msg.sender][opponent];
                        }
                        if (dmg >= hps[msg.sender][opponent]) {
                            // dead
                            hps[msg.sender][opponent] = 0;
                            armors[msg.sender][opponent] = 0;
                            armors[opponent][msg.sender] = 0;
                        } else {
                            // alive
                            hps[msg.sender][opponent] -= dmg;
                            isTurns[opponent][msg.sender] = true;
                        }
                    } else {
                        // Kick
                        uint8 dmg = dice(minKick, maxKick);
                        if (dmg < armors[opponent][msg.sender]) {
                            // default dmg
                            dmg = defaultDmg;
                        } else {
                            // armored
                            dmg -= armors[opponent][msg.sender];
                        }
                        if (dmg >= hps[opponent][msg.sender]) {
                            // dead
                            hps[opponent][msg.sender] = 0;
                            armors[msg.sender][opponent] = 0;
                            armors[opponent][msg.sender] = 0;
                        } else {
                            // alive
                            hps[opponent][msg.sender] -= dmg;
                            isTurns[opponent][msg.sender] = true;
                        }
                    }
                }
            } else {
                if (isPunchOrDefend) {
                    // Defend
                    uint8 def = dice(minDefend, maxDefend);
                    if (armors[msg.sender][opponent] + def > maxArmor) {
                        armors[msg.sender][opponent] = maxArmor;
                    } else {
                        armors[msg.sender][opponent] += def;
                    }
                } else {
                    // Run
                    hps[msg.sender][opponent] = 0;
                    armors[msg.sender][opponent] = 0;
                    armors[opponent][msg.sender] = 0;
                }
            }
        }
    }

    function dice(uint8 low, uint8 high) internal view returns (uint8) {
        // naive exploitable rng for now
        // bytes32 aaa = keccak256(bytes("1"));
        return low + uint8(block.timestamp % (1 + high - low));
    }
}
