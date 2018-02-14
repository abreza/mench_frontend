import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    editProfile
} from '../../modules/funcs'

class EditProfileForm extends React.Component {
    handleSignIn(e) {
        e.preventDefault()
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let first_name = this.refs.first_name.value;
        let last_name = this.refs.last_name.value;
        let gender = this.refs.gender.value;
        let city = this.refs.city.value;
        this.props.onEditProfile(username, password, first_name, last_name, gender, city)
    }
    render() {
        return (
            <form onSubmit={this.handleSignIn.bind(this)}>
                <h3>edit</h3>
                <input type="username" ref="username" value={this.props.user.get('username')}/>
                <input type="text" ref="first_name" placeholder="enter your first_name"/>
                <input type="text" ref="last_name" placeholder="enter your last_name"/>
                <input type="text" ref="gender" placeholder="enter your gender"/>
                <input type="text" ref="city" placeholder="enter your city"/>
                <input type="password" ref="password" placeholder="enter password"/>
                <input type="submit" value="Edit"/>
            </form>
        )
    }
}

const EditProfile = props => (
    <div>
        <h1>My cool App</h1>
        {
            (props.user) ?
                <EditProfileForm onEditProfile={props.editProfile} user={props.user}/>
                :
                <p>you are not signed in</p>
        }
    </div>
);

const mapStateToProps = state => ({
    user: state.funcs.user,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    editProfile
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditProfile)
