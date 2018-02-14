import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    randomGenerator
} from '../../modules/funcs'


let Background = 'board.gif'
const Game = props => {
    if(props.game){
        var table = []

        for (var i = 0; i < 10; i++) {
            var row = [];
            for (var j = 0; j < 10; j++) {
                let x = (i%2)?10 * (9 - i) + (j) + 1:10 * (9 - i) + (9 - j) + 1
                row.push(<td style={{textAlign:'center', height : '60px', width : '60px'}}>{x == props.game.get('player1_position')?<img style={{height : '60px', width : '60px'}} src={'blue.png'}/>:null}</td>);
            }
            table.push(<tr >{row}</tr>);
        }
    }
    return(
    <div>
        <div>
            {props.game?
                <div>
                <table style={{
                    backgroundImage: `url(${Background})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    width: '70%',
                    float: 'left',
                }}>
                    {table}
                </table>
                    <img onClick={props.randomGenerator} style={{
                        width:'10%',
                        height:'10%',
                    }} src={'toss.jpg'}></img>
                    <p>{props.toss}</p>
                </div>
            :
                null
            }
        </div>
    </div>
)};

const mapStateToProps = state => ({
    user: state.funcs.user,
    game: state.funcs.game,
    toss: state.funcs.toss,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    randomGenerator
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)






// <div>
// {   props.game?
// <div>
//     /*gameId: {props.game.id}*/
//     <table>
//         <tr height="10px">
//             {indents}
//         </tr>
//     </table>
// </div>
// //     :
// //     <Link to={'/'}>home</Link>
// // }
// </div>