import React, {Component} from 'react'
import './HeaderMenu.css'

class HeaderMenu extends Component{
    render(){
        return(
            <div className = "HeaderMenu">
               <a> Menu </a>
               <a> Citchen </a>
               <a> Officiants </a>
            </div>
        )
    }
}

export default HeaderMenu;