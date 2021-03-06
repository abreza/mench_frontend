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


export const live = () =>{
    let Game = Parse.Object.extend("Game");
    let query = new Parse.Query(Game);
    let subscription = query.subscribe();
    return dispatch =>{
        subscription.on('update', (game) => {
            dispatch({
                type: PLAY,
                player2: game.get('player2'),
                player1: game.get('player1'),
                position1: game.get('player1_position'),
                position2: game.get('player2_position'),
                turn: game.get('turn'),
            })
        });
    }
}

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
    win: -1,
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
            state.place[0] = action.position1;
            state.place[1] = action.position2;
            return{
                ...state,
                player1: action.player1,
                player2: action.player2,
                turn: state.myTurn,
                place: state.place,
                turn: action.turn,
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
            if(state.turn == state.myTurn && state.win==-1){
                let random = parseInt((Math.random() * 6) + 1);
                let t = state.myTurn - 1
                if(state.player2 == 'bot'){
                    if(state.place[t] + random <= 100){
                        state.place[t] += random;
                        state.place[t] = map.get(state.place[t]) || state.place[t]
                        state.game.set('player' + (t + 1) + '_position', state.place[t])
                        state.game.set('turn', 2 - t)
                        state.game.save()
                        if(state.place[t] == 100){
                            state.user.set('score', state.user.get('score') + 150)
                            state.game.set('turn', 2 - t)
                            state.user.save()
                            return{
                                ...state,
                                place: state.place,
                                toss: random,
                                finish: true,
                                win:1,
                            }
                        }
                    }
                    state.game.set('player' + (t + 1) + '_position', state.place[t])
                    state.game.set('turn', 2 - t)
                    state.game.save()
                    random = parseInt((Math.random() * 6) + 1);
                    t = 1
                    if(state.place[t] + random <= 100){
                        state.place[t] += random;
                        state.place[t] = map.get(state.place[t]) || state.place[t]
                        state.game.set('player' + (t + 1) + '_position', state.place[t])
                        state.game.set('turn', 2 - t)
                        state.game.save()
                        if(state.place[t] == 100){
                            state.user.set('score', state.user.get('score') + 50)
                            state.user.save()
                            return{
                                ...state,
                                place: state.place,
                                toss: random,
                                finish: true,
                            }
                        }

                    }
                    state.game.set('player' + (t + 1) + '_position', state.place[t])
                    state.game.set('turn', 2 - t)
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
                        state.game.set('turn', 2 - t)
                        state.game.save()
                        if(state.place[t] == 100){
                            state.user.set('score', state.user.get('score') + 150)
                            state.user.save()
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
        user.set("score", 0);
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


export const editProfile = (username, password, first_name, last_name, gender, birthday, city) => {
    let User = Parse.Object.extend("User");
    let query = new Parse.Query(User);
    let subscription = query.subscribe();
    return dispatch => {
        query.equalTo("username", username);
        query.find({
            success: function (list) {
                if (list.length) {
                    let user1 = list[0]
                    user1.set("password", password);
                    user1.set("first_name", first_name);
                    user1.set("last_name", last_name);
                    user1.set("gender", gender);
                    user1.set("city", city);
                    user1.set("score", 0);
                    user1.save()
                }
            }
        })
    }
}

export const createNewGame = () => {
    let Game = Parse.Object.extend("Game");
    let query = new Parse.Query(Game);
    let subscription = query.subscribe();
    return dispatch => {
        let newGame = new Game();
        newGame.set("player1", Parse.User.current().get('username'));
        newGame.set("player1_position", 0);
        newGame.set("player2_position", 0);
        newGame.set("turn", 1);
        newGame.save(null, {
            success: function(new_game) {
                dispatch({
                    type: CREATE_NEW_GAME_REQUEST,
                    game: new_game
                });
                alert('created')

                return setTimeout(() => {
                    dispatch({
                        type: PLAY,
                        player2: 'bot',
                        player1: Parse.User.current().get('username'),
                        position1: 0,
                        position2: 0,
                        turn: 1,
                    })
                },  20000)
            },
            error: function(new_game, error) {
                alert('Failed to create new Game, with error code: ' + error.message);
            }
        });
    }
}

export const joinToGame = (gameId) => {
    let Game = Parse.Object.extend("Game");
    let query = new Parse.Query(Game);
    let subscription = query.subscribe();
    return dispatch => {
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
                        turn: 1,
                    });
                    alert('you joined to this game ' + list[0].id)
                }
            },
            error: function(list) {
            }
        });
    }
}

