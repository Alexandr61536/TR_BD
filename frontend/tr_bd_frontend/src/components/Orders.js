import React, {Component} from 'react'
import './Orders.css'

class Orders extends Component{

    state={
        orders: []
    }

    componentDidMount() {
        fetch('http://'+this.props.ip+':3010/api/orders')
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({orders: result.data})
            },
            (error) => {
                console.log(error);
            }
        )
    }

    render(){
        return(
            <div className='OrdersContainer'>
                {JSON.stringify(this.state.orders)}
            </div>
        )
    }
}

export default Orders;