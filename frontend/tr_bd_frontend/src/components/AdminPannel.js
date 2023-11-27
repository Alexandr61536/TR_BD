import React, { Component } from 'react';
import './AdminPannel.css'

class AdminPannel extends Component {
    state={
        orders: [],
        ready: [],
        users: []
    }
    componentDidMount(){
        fetch('http://'+this.props.ip+':3010/api/orders_all')
        .then(res => res.json())
        .then(
            (result) => {
                const groupedOrders = result.data.reduce((acc, obj) => {
                    const key = obj.idorder;
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                  }, {});
                  const res = Object.values(groupedOrders);
                this.setState({orders: res})
            },
            (error) => {
                console.log(error);
            }
        )
        fetch('http://'+this.props.ip+':3010/api/users')
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({users: result.data})
            }
        )
    }

    sendregister = async() => {
        await fetch("http://" + this.props.ip + ":3010/api/add_user", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({"login": this.state.adding_login, "password": this.state.adding_password, "role": this.state.adding_role})
        });        
    }

    delete_user=async(action_idorder)=>{
        await fetch("http://" + this.props.ip + ":3010/api/delete_user", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({id: action_idorder})
        })
    }

    render(){
        return(
            <div className='AdminPannelContainer'>
                <div className='AdminOrdersContainer'>
                    <table className='AdminOrdersTable'>
                        <tr><td>IDorder</td><td>Client</td><td>Dishes</td><td>Status</td></tr>
                        {this.state.orders.map(order=>(
                        <tr>
                            <td>{order.length>0?order[0].idorder:''}</td>
                            <td>{order.length>0?order[0].login:''}</td>
                            <td><ul>
                                {order.map(dish=>(
                                <li>{dish.dish}</li>
                                ))}
                            </ul></td>
                            <td>
                                {order[0].state}
                            </td>
                        </tr>))}
                    </table>
                </div>

                <div className='UsersContainer'>
                    <table className='UsersTable'>
                        <tr><td>IDClient</td><td>Login</td><td>Password</td><td>Role</td><td>IDOrder</td><td>Delete</td></tr>
                        {this.state.users.map(user=>(
                        <tr>
                            <td>{user.idclient}</td>
                            <td>{user.login}</td>
                            <td>{user.password}</td>
                            <td>{user.role}</td>
                            <td>{user.idorder}</td>
                            <td>
                                <button className='DeleteButton' onClick={()=>{this.delete_user(user.idclient)}}>x</button>
                            </td>
                        </tr>))}
                    </table>
                </div>

                <div className="AddUserContainer">
                    <div className='RegisterForm'>
                    <div className='register_inputs_container'>
                        <span className='label_register'>Login</span><br/>
                        <input placeholder='login' className="register_login_input" onChange={(event)=>this.setState({adding_login: event.target.value})}>

                        </input><br/>
                        <input placeholder='password'  className="register_password_input"  onChange={(event)=>this.setState({adding_password: event.target.value})}>

                        </input><br/>
                        <input placeholder='role'  className="register_role_input"  onChange={(event)=>this.setState({adding_role: event.target.value})}>

                        </input><br/>
                        <button className='admin_send_register_button' onClick={this.sendregister}>Register</button>
                    </div>
                    </div>
                </div>

            </div>

            
        )
    }
}

export default AdminPannel;