import {BOARD_SIZE, DATA, VIEW} from "../config/enum";

const directions = [
    (i, j) => [--i, --j],
    (i, j) => [--i, ++j],
    (i, j) => [++i, --j],
    (i, j) => [++i, ++j],
];

const validate = (i, j) => i >= 0 && j >= 0 && i < BOARD_SIZE && j < BOARD_SIZE;

const isEnemy = (elem, isWhiteTurn) => {
    return isWhiteTurn
        ? elem === DATA.BLACK || elem === DATA.BLACK_KING
        : elem === DATA.WHITE || elem === DATA.WHITE_KING;
}

export const isAlly = (elem, isWhiteTurn) => {
    return isWhiteTurn
        ? elem === DATA.WHITE || elem === DATA.WHITE_KING
        : elem === DATA.BLACK || elem === DATA.BLACK_KING;
}

const isKing = elem => elem === DATA.WHITE_KING || elem === DATA.BLACK_KING;

const isMinion = elem => (elem === DATA.WHITE || elem === DATA.BLACK);

export const createEmptyMatrix = () => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(VIEW.EMPTY));

class View {

    constructor(i, j, data, isWhiteTurn) {
        this.i = i;
        this.j = j;
        this.requireKill = false;
        this.isBlocked = false;
        this.matrix = this.createMatrix(i, j, data, isWhiteTurn);
    }

    createMatrix(i, j, data, isWhiteTurn) {

        let counter = 0;
        let view = createEmptyMatrix();

        if (isAlly(data[i][j], isWhiteTurn)) {

            view[i][j] = VIEW.ACTUAL;

            if (isKing(data[i][j])) {
                directions.forEach(dir => {
                    let [di, dj] = dir(i, j);
                    while (validate(di, dj)) {
                        if (isAlly(data[di][dj], isWhiteTurn)) {
                            break;
                        } else if (isEnemy(data[di][dj], isWhiteTurn)) {
                            let [x, y] = dir(di, dj);
                            while (validate(x, y) && data[x][y] === DATA.EMPTY) {
                                view[di][dj] = VIEW.KILLABLE;
                                view[x][y] = VIEW.NECESSARY;
                                [x, y] = dir(x, y);
                                counter++;
                            }
                            break;
                        } else {
                            view[di][dj] = VIEW.AVAILABLE;
                            counter++;
                        }
                        [di, dj] = dir(di, dj);
                    }
                });
            } else if (isMinion(data[i][j])) {
                directions.forEach(dir => {
                    let [di, dj] = dir(i, j);
                    if (validate(di, dj)) {
                        if (isAlly(data[di][dj], isWhiteTurn)) {
                            // nothing
                        } else if (isEnemy(data[di][dj], isWhiteTurn)) {
                            let [x, y] = dir(di, dj);
                            if (validate(x, y) && data[x][y] === DATA.EMPTY) {
                                view[di][dj] = VIEW.KILLABLE;
                                view[x][y] = VIEW.NECESSARY;
                                counter++;
                            }
                        } else {
                            view[di][dj] = VIEW.AVAILABLE;
                            counter++;
                        }
                    }
                });
            }

            // clean view
            if (view.some(row => row.includes(VIEW.NECESSARY))) {
                this.requireKill = true;
                view = view.map(row => row.map(elem => {
                    if (elem === VIEW.AVAILABLE) {
                        elem = VIEW.EMPTY;
                        counter--;
                    }
                    return elem;
                }));
            } else if (isWhiteTurn && isMinion(data[i][j])) {
                view = view.map((row, di) => row.map(elem => {
                    if (i < di) {
                        if (elem !== VIEW.EMPTY) {
                            elem = VIEW.EMPTY;
                            counter--;
                        }
                    }
                    return elem;
                }));
            } else if (!isWhiteTurn && isMinion(data[i][j])) {
                view = view.map((row, di) => row.map(elem => {
                    if (i > di) {
                        if (elem !== VIEW.EMPTY) {
                            elem = VIEW.EMPTY;
                            counter--;
                        }
                    }
                    return elem;
                }));
            }
        }

        if (counter === 0) {
            this.isBlocked = true;
        }

        return view;
    }
}

export default View;