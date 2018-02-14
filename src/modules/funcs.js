import Parse from 'parse'
export const MOVE_REQUESTED = 'funcs/MOVE_REQUESTED'
export const SIGN_IN = 'funcs/SIGN_IN'
export const SIGN_OUT = 'funcs/SIGN_OUT'
export const SIGN_UP = 'funcs/SIGN_UP'
export const CREATE_NEW_GAME_REQUEST = 'funcs/CREATE_NEW_GAME_REQUEST'
export const JOIN_GAME = 'funcs/JOIN_GAME'
export const PLAY = 'funcs/PLAY'

let map = new Map()
map.set(1,38)
map.set(4,14)
map.set(9,31)
map.set(17,7)
map.set(21,42)
map.set(28,84)
map.set(54,34)
map.set(51,67)
map.set(62,19)
map.set(64,60)
map.set(80,100)
map.set(87,24)
map.set(71,91)
map.set(93,73)
map.set(95,75)
map.set(98,79)

const initialState = {
    turn: 1,
    place: [0,0],
    myTurn: 1,
    user: null,
    player1: null,
    player2: null,
    game: null,
    startGame: false,
    finish: false,
    toss: 0,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_NEW_GAME_REQUEST:
            return{
                ...state,
                game: action.game,
                myTurn: 1,
                player1: state.user.get('username'),
                player2: action.player2,
            }
        case JOIN_GAME:
            return{
                ...state,
                game: action.game,
                startGame: true,
                myTurn: 2,
                player1: action.player1,
                player2: state.user.get('username'),
            }
        case PLAY:
            if(state.player2 && state.player2!=action.player2)
                return state
            state.place[2 - state.myTurn] = action.position;
            return{
                ...state,
                player2: action.player2,
                turn: state.myTurn,
                place: state.place,
            }
        case SIGN_UP:
            return{
                ...state,
                user: action.user
            }
        case SIGN_IN:
            return{
                ...state,
                user: action.user
            }
        case SIGN_OUT:
            return{
                ...state,
                user: null
            }
        case MOVE_REQUESTED:
            if(state.turn == state.myTurn){
                let random = parseInt((Math.random() * 6) + 1);
                let t = 0
                if(state.player2 == 'bot'){
                    if(state.place[t] + random <= 100){
                        state.place[t] += random;
                        state.place[t] = map.get(state.place[t]) || state.place[t]
                        state.game.set('player' + (t + 1) + '_position', state.place[t])
                        state.game.save()
                        if(state.place[t] == 100){
                            return{
                                ...state,
                                place: state.place,
                                toss: random,
                                finish: true,
                            }
                        }
                    }
                    state.game.set('player' + (t + 1) + '_position', state.place[t])
                    state.game.save()
                    random = parseInt((Math.random() * 6) + 1);
                    t = 1
                    if(state.place[t] + random <= 100){
                        state.place[t] += random;
                        state.place[t] = map.get(state.place[t]) || state.place[t]
                        state.game.set('player' + (t + 1) + '_position', state.place[t])
                        state.game.save()
                        if(state.place[t] == 100){
                            return{
                                ...state,
                                place: state.place,
                                toss: random,
                                finish: true,
                            }
                        }

                    }
                    state.game.set('player' + (t + 1) + '_position', state.place[t])
                    state.game.save()
                    return{
                        ...state,
                        place: state.place,
                        toss: random,
                    }
                }
                else{
                    if(state.place[t] + random <= 100){
                        state.place[t] += random;
                        state.place[t] = map.get(state.place[t]) || state.place[t]
                        state.game.set('player' + (t + 1) + '_position', state.place[t])
                        state.game.save()
                        if(state.place[t] == 100){
                            return{
                                ...state,
                                place: state.place,
                                toss: random,
                                finish: true,
                            }
                        }

                    }
                    return{
                        ...state,
                        place: state.place,
                        turn: (state.turn) % 2 + 1,
                        toss: random,
                    }
                }
            }
            return state
        default:
            return state
    }
}


export const randomGenerator = () => {
    return dispatch => {
        dispatch({
            type: MOVE_REQUESTED
        });
    }
}

export const signIn = (user, pass) => {
    return dispatch => {
        Parse.User.logIn(user, pass, {
            success: function(user) {
                dispatch({
                    type: SIGN_IN,
                    user: user,
                });
            },
            error: function(user, error) {
                alert("Error: " + error.message);
            }
        });
    }
}

export const signOut = () => {
    return dispatch => {
        dispatch({
            type: SIGN_OUT
        });
    }
}


export const signUp = (username, password, first_name, last_name, gender, birthday, city) => {
    return dispatch => {
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", password);
        user.set("first_name", first_name);
        user.set("last_name", last_name);
        user.set("gender", gender);
        user.set("city", city);
        user.signUp(null, {
            success: function(user) {
                dispatch({
                    type: SIGN_UP,
                    user: user,
                });
            },
            error: function(user, error) {
                alert("Error: " + error.message);
            }
        });
    }
}

export const createNewGame = () => {
    return dispatch => {
        let Game = Parse.Object.extend("Game");
        let query = new Parse.Query(Game);
        let newGame = new Game();
        newGame.set("player1", Parse.User.current().get('username'));
        newGame.set("player1_position", 0);
        newGame.set("player2_position", 0);
        newGame.save(null, {
            success: function(new_game) {
                let subscription = query.subscribe();
                subscription.on('update', (game) => {
                    dispatch({
                        type: PLAY,
                        player2: game.get('player2'),
                        position: game.get('player2_position')
                    })
                });
                dispatch({
                    type: CREATE_NEW_GAME_REQUEST,
                    game: new_game
                });
                alert('created')

                return setTimeout(() => {
                    dispatch({
                        type: PLAY,
                        player2: 'bot',
                        position: 0,
                    })
                }, 20000)
            },
            error: function(new_game, error) {
                alert('Failed to create new Game, with error code: ' + error.message);
            }
        });
    }
}

export const joinToGame = (gameId) => {
    return dispatch => {
        let Game = Parse.Object.extend("Game");
        let subscription = Game.subscribe();
        subscription.on('update', (game) => {
            alert('update')
            dispatch({
                type: PLAY,
                position: game.get('player1_position')
            })
        });
        let query = new Parse.Query(Game);
        query.equalTo("objectId", gameId);
        query.find({
            success:function(list) {
                if(list.length && !list[0].get('player2')){
                    let game = list[0]
                    game.set('player2', Parse.User.current().get('username'))
                    game.save(null)
                    dispatch({
                        type: JOIN_GAME,
                        game: game,
                        player1: game.get('player1'),
                    });
                    alert('you joined to this game ' + list[0].id)
                }
            },
            error: function(list) {
            }
        });
    }
}

