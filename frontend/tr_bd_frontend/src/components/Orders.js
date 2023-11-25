import React, {Component} from 'react'
import './Orders.css'

class Orders extends Component{

    state={
        orders: [],
        ready: []
    }

    componentDidMount() {
        fetch('http://'+this.props.ip+':3010/api/orders')
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
    }

    order_is_ready=async(action_idorder)=>{
        let tmp = this.state.orders;
        for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i].idorder === action_idorder) {
                tmp.splice(i);
            }
        }
        this.state.ready.push(action_idorder);
        this.setState({orders: tmp});
        await fetch("http://" + this.props.ip + ":3010/api/order_ready", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({idorder: action_idorder})
        })
    }

    render(){
        return(
            <div className='OrdersContainer'>
                <table className='OrdersTable'>
                    <tr><td>IDorder</td><td>Client</td><td>Dishes</td><td>Ready</td></tr>
                    {this.state.orders.map(order=>(
                    <tr>
                        <td>{order.length>0?order[0].idorder:''}</td>
                        <td>{order.length>0?order[0].login:''}</td>
                        <td><ul>
                            {order.map(dish=>(
                            <li>{dish.dish}</li>
                            ))}
                        </ul></td>
                        <td><button 
                                className='ReadyButton' 
                                onClick={()=>{this.order_is_ready(order[0].idorder)}} 
                                disabled={this.state.ready.includes(order[0].idorder)}
                            >Ready</button></td>
                    </tr>))}
                </table>
                
            </div>
        )
    }
}

export default Orders;