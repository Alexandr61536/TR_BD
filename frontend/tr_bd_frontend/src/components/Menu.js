import React, {Component} from 'react'
import './Menu.css'

class Menu extends Component{

    state={
        'menu_list': [],
        'cart': []
    }

    componentDidMount() {
        fetch('http://'+this.props.ip+':3010/api/Menu')
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({menu_list: result.data})
            },
            (error) => {
                console.log(error);
            }
        )
    }

    add_dish=(dish)=>{
        let tmp = this.state.cart;
        tmp.push(dish);
        this.setState({cart: tmp});
    }

    order=async()=>{
        await fetch("http://" + this.props.ip + ":3010/api/order", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({login: this.props.login, dishes: this.state.cart})
        })
    }

    render(){
        return(
            <div className='MenuContainer'>
                <table className='MenuTable'>
                    <tr>
                            <td> Dish </td>
                            <td> Fats </td>
                            <td> Proteins </td>
                            <td> Carbohydrates </td>
                            <td> Calories </td>
                            <td> Description </td>
                            <td> Add</td>
                    </tr>
                    {this.state.menu_list.map(dish_from_list=>(
                        <tr> 
                            <td className="td_dish">{dish_from_list.dish}</td> 
                            <td className="td_fats">{dish_from_list.fats}</td>
                            <td className="td_prot">{dish_from_list.proteins}</td> 
                            <td className="td_carb">{dish_from_list.carbohydrates}</td> 
                            <td className="td_calo">{dish_from_list.calories}</td> 
                            <td className="td_desc">{dish_from_list.description}</td> 
                            <td><button 
                                className='AddButton' 
                                onClick={()=>this.add_dish(dish_from_list.dish)} 
                                disabled={this.state.cart.includes(dish_from_list.dish)}
                            >+</button></td>
                        </tr>
                    ))}
                </table>
               <button className='order_button' onClick={this.order}>Order</button>
            </div>
        )
    }
}

export default Menu;