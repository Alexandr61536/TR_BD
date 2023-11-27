import React, {Component} from 'react'
import './LoginForm.css'

class LoginForm extends Component{

    state={}

    sendlogin = async() => {
        await fetch("http://" + this.props.ip + ":3010/api/login", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({"login": this.state.login, "password": this.state.password})
        })
        .then(responce => {
                responce.json().then(json=>{
                    console.log(json.role)
                    this.setState({accepted: json.accepted});
                    if (json.accepted === 'y'){
                        this.props.name_role_set(this.state.login, json.role);
                    }
                });
        });        
    }

    sendregister = async() => {
        await fetch("http://" + this.props.ip + ":3010/api/register", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({"login": this.state.login, "password": this.state.password})
        })
        .then(responce => {
            responce.json().then(json=>{
                console.log(json.role)
                this.setState({accepted: json.accepted});
                if (json.accepted === 'y'){
                    this.props.name_role_set(this.state.login, json.role);
                }
            });
    });        
    }

    render(){
        return(
            <div className='LoginForm'>
                <div className='inputs_container'>
                    <span className='label_login'>Login</span><br/>
                    <input placeholder='login' className="login_input" onChange={(event)=>this.setState({login: event.target.value})}>

                    </input><br/>
                    <input placeholder='password'  className="password_input"  onChange={(event)=>this.setState({password: event.target.value})}>

                    </input><br/>
                    <button className='send_login_button' onClick={this.sendlogin}>Login</button>
                    <button className='send_register_button' onClick={this.sendregister}>Register</button>
                    {this.state.accepted === 'n' ? <p className='login_status_label'> Failed to login </p> : ''}
                </div>
            </div>
        )
    }
}

export default LoginForm;