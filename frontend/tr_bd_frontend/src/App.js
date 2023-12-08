import React, {Component} from 'react'
import './App.css';
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import Orders from './components/Orders'
import ReadyOrders from './components/ReadyOrders'
import ClientPage from './components/ClientPage';
import AdminPannel from './components/AdminPannel';

class App extends Component {

  state={
	ip: '127.0.0.1',
	//ip: '192.168.156.205',
    mode: "unlogined",
	role: ""
  }

  changemode_login = (text) => {
	if (this.state.mode != 'logining'){
		this.setState({mode: "logining"})
	}
	else if (this.state.mode === 'logining'){
		this.setState({mode: "unlogined"})
	}
  }

  name_role_set = (name, role)=>{
	console.log(name, role);
	this.setState({user_name: name});
	this.setState({user_role: role});
	this.setState({mode: "logined"});
  }

  render(){ 
    return (
      <div className="App">
        	<Header 
				changemode_login={this.changemode_login} 
				user_name={this.state.user_name} 
				user_role={this.state.user_role} 
				logined={this.state.mode}
			/>
        	{(this.state.mode == 'logining') ? <LoginForm ip={this.state.ip} name_role_set={(name, role)=>this.name_role_set(name, role)} /> : 
			(this.state.user_role=='client') ? <ClientPage ip={this.state.ip} user_name={this.state.user_name}/>: 
			(this.state.user_role=='cook') ? <Orders ip={this.state.ip}/> : 
			(this.state.user_role=='officiant')? <ReadyOrders ip={this.state.ip}/> :
			(this.state.user_role=='admin')? <AdminPannel ip={this.state.ip} />: ''}
      </div>
    );
  } 
 
}

export default App;
