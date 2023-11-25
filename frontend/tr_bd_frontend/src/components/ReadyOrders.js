import React, { Component} from 'react'
import './ReadyOrders.css'

class ReadyOrders extends Component {

    state={
        orders: [],
        ready: []
    }

    componentDidMount() {
        fetch('http://'+this.props.ip+':3010/api/ready_orders')
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
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

    order_is_payed=async(action_idorder)=>{
        let tmp = this.state.orders;
        for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i].idorder === action_idorder) {
                tmp.splice(i);
            }
        }
        this.state.ready.push(action_idorder);
        this.setState({orders: tmp});
        await fetch("http://" + this.props.ip + ":3010/api/order_payed", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({idorder: action_idorder})
        })
    }

    render(){
        return(
            <div className='ReadyOrdersContainer'>
                <table className='ReadyOrdersTable'>
                    <tr><td>IDorder</td><td>Client</td><td>Dishes</td><td>Payed</td></tr>
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
                                className='PayedButton' 
                                onClick={()=>{this.order_is_payed(order[0].idorder)}} 
                                disabled={this.state.ready.includes(order[0].idorder)}
                            >Payed</button></td>
                    </tr>))}
                </table>
                
            </div>
        )
    }
}

export default ReadyOrders;