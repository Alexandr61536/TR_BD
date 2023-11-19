import React, {Component} from 'react'
import './Header.css'
import HeaderMenu from './HeaderMenu'
import Logo from './Logo'
import Login from './Login'

class Header extends Component{
    render(){
        return(
            <div className = "header_container">
                <Logo />
                <div className='right_part_header'>
                    {this.props.logined==='logined' ? <div className='user_label'>{this.props.user_name} {this.props.user_role}</div> : <Login changemode_login={this.props.changemode_login}/>}
                    {/* <HeaderMenu /> */}
                </div>
            </div>
        )
    }
}

export default Header;