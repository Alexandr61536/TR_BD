import React, { Component } from 'react';
import './OrdersToPay.css';

class OrdersToPay extends Component {

    state={
        order: [],
        ready: false
    }

    initialPOST = async()=> {
        await fetch("http://" + this.props.ip + ":3010/api/orders_to_pay", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({login: this.props.login})
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({order: result.body})
            },
            (error) => {
                console.log(error);
            })
    }

    got=async()=>{
        this.setState({payed: true});
        await fetch("http://" + this.props.ip + ":3010/api/order_got", {
            method: 'POST',
            headers:{
                'content-type': 'application/json;charser=utf-8'
            },
            body: JSON.stringify({idorder: this.state.order[0].idorder})
        })
    }

    componentDidMount (){
        this.initialPOST();
    }

    render() {
        return (
            <div className='OrdersToPay_container'>
                <table className='OrdersToPay_table'>
                    <tr><td>IDorder</td><td>Dish</td></tr>
                    {this.state.order.map((dish)=>(
                        <tr>
                            <td>{dish.idorder}</td> <td>{dish.dish}</td>
                        </tr>
                    ))}
                </table>
                <button 
                    className='Got_button' 
                    onClick={()=>this.got()}
                    disabled={this.state.payed}
                >Got</button>
            </div>
        );
    }
}

export default OrdersToPay;