import React from 'react';
import { Route, Link } from 'react-router-dom'
import Home from '../home'
import About from '../about'
import Login from '../login'
import SignUp from '../signUp'
import EditProfile from '../edit_profile'
import Game from '../Game'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    signOut,
    live,
} from '../../modules/funcs'
import Parse from 'parse'
import withRouter from "react-router-dom/es/withRouter";

const App = (props) =>
{
    Parse.serverURL = 'http://localhost:8030/wp';
    Parse.initialize("myAppId123456", '1xoWtDkxw8oZvX3bzhdTuHU7KZB8SGZD9jWQ2V9p');
    props.live()
    return(
        <div>
            <header>
                <Link to="/">Home</Link>
                <Link to="/about-us">About</Link>
                <Link to="/login" style={{display: !props.user ? '' : 'none'}}>Login</Link>
                <Link to="/signUp" style={{display: !props.user ? '' : 'none'}}>SignUp</Link>
                <Link to="/edit">EditProfile</Link>
                <button style={{display: props.user ? '' : 'none'}} onClick={props.signOut}>Sign out</button>
            </header>

            <main>
                <Route exact path="/" component={Home}/>
                <Route exact path="/about-us" component={About}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/signUp" component={SignUp}/>
                <Route exact path="/game" component={Game}/>
                <Route exact path="/edit" component={EditProfile}/>
            </main>
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.funcs.user,
})
const mapDispatchToProps = dispatch => bindActionCreators({
    signOut,
    live,
}, dispatch)

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))
