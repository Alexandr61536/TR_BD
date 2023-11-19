import React, {Component} from 'react'
import './Login.css'

class Login extends Component{
    login_func=()=>{
        this.props.changemode_login('logining');
    }

    render(){
        return(
            <div className = "Login" onClick={this.login_func}>
               Login
            </div>
        )
    }
}

export default Login;