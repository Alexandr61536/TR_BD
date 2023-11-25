import React, {Component} from "react";
import Menu from './Menu' 
import OrdersToPay from './OrdersToPay';

function ClientPage(props) {
    return(
        <div className="ClientPage_container">
            <Menu ip={props.ip} login={props.user_name}/> 
            <OrdersToPay ip={props.ip} login={props.user_name}/>
        </div>
    );
}
export default ClientPage;