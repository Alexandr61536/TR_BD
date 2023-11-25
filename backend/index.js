const express = require('express');
const cors = require('cors')

const PORT = process.env.PORT || 3010;
const path = require('node:path'); 

const app = express();
app.use(cors())
app.use(express.static(path.resolve('../frontend/build')));
app.use(express.json())

const Sequelize = require("sequelize");
const sequelize = new Sequelize("restaurant", "postgres", "admin", {
  dialect: "postgres"
});

  const client = sequelize.define("clients", {
    idclient:{
      type: Sequelize.INTEGER,
        autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    idorder:{
      type: Sequelize.INTEGER,
      allowNull: true
    },
    login:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    password:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    role:{
      type: Sequelize.TEXT,
      allowNull: true
    }
  },{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  })

  const dish = sequelize.define("dishes", {
    dish:{
        type: Sequelize.TEXT,
        primaryKey: true
    },
    fats:{
        type: Sequelize.INTEGER
    },
    proteins:{
      type: Sequelize.INTEGER
    },
    carbohydrates:{
      type: Sequelize.INTEGER
    },
    calories:{
      type: Sequelize.INTEGER
    },
    description:{
      type: Sequelize.TEXT
    }
   },{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  })
  
  const order = sequelize.define("orders", {
	idorder:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	state:{
		type: Sequelize.INTEGER,
	},
	update_time:{
		type: Sequelize.TIME
	}
  },{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  })

  const dish_order = sequelize.define("dishes_order", {
	idorder:{
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	dish:{
		type: Sequelize.TEXT,
		primaryKey: true
	}
  },{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  })

  sequelize.sync().then(result=>{{}
    }).catch(err=> console.log(err));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/api/Menu', (req, res) => {
	sequelize
	.query("SELECT * from clients_orders_dishes WHERE login = '" + req.body.login + "'", {
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then(search_result=>{
		dish.findAll({raw: true}).then(dishes=>{
			res.json({data: dishes, unfinished_orders: search_result.length != 0});
		  })
	})
  
});

app.post('/api/login', (req, res) => {
  client.findOne({where:{login: req.body.login, password: req.body.password}}).then(clients=>{
    if (clients){
      res.json({"accepted": "y", "role": clients.role});
    }
    else{
      res.json({"accepted": "n", "role": "none"});
    }
  });
})

app.post('/api/register', (req, res) => {
  client.create({
    login: req.body.login,
    password: req.body.password,
    role: "client"
  }).then(()=>{
    client.findOne({where:{login: req.body.login, password: req.body.password}}).then(clients=>{
      if (clients){
        res.json({"accepted": "y", "role": clients.role});
      }
      else{
        res.json({"accepted": "n", "role": "none"});
      }
    });
  }).catch(err=>console.log(err));
})

app.post('/api/order', (req, res) => {
	order.create({
		update_time: sequelize.fn('NOW')
	})
	.then(adding_order=>{
		for (let i=0; i < req.body.dishes.length; i++)
		{
			dish_order.create({
				idorder: adding_order.idorder,
				dish: req.body.dishes[i]
			})
		}
    client.update({idorder: adding_order.idorder}, 
      {where: {
        login: req.body.login
        }
      })
	})
})

app.get('/api/orders', (req, res) => {
  sequelize
    .query("SELECT * FROM clients_orders_dishes WHERE state = 'received' ", {
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => res.json({data: result}));
  });

  app.post('/api/order_ready', (req, res) => {
	sequelize
    .query("UPDATE orders SET state = 'cooked', update_time = NOW() WHERE idorder = "+req.body.idorder, {
        raw: true,
        type: Sequelize.QueryTypes.UPDATE,
    })
})

app.get('/api/ready_orders', (req, res) => {
	sequelize
	  .query("SELECT * FROM clients_orders_dishes WHERE state = 'cooked' ", {
		  raw: true,
		  type: Sequelize.QueryTypes.SELECT,
	  })
	  .then((result) => {
		if (result.length === 0){
			sequelize
			.query("SELECT * FROM clients_orders_dishes WHERE state = 'got' ", {
				raw: true,
				type: Sequelize.QueryTypes.SELECT,
	  		}).then((result) => {res.json({data: result})});
		}
		else{
			res.json({data: result})}
		}
	  );
	});
  
	app.post('/api/order_ready', (req, res) => {
	  sequelize
	  .query("UPDATE orders SET state = 'cooked', update_time = NOW() WHERE idorder = "+req.body.idorder, {
		  raw: true,
		  type: Sequelize.QueryTypes.UPDATE,
	  })
  })

  app.post('/api/order_payed', (req, res) => {
	sequelize
	.query("SELECT * from clients_orders_dishes WHERE state = 'got' and idorder = " + req.body.idorder, {
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then((result) => {
		if (result.length === 0){
			sequelize
			.query("UPDATE orders SET state = 'payed', update_time = NOW() WHERE idorder = "+req.body.idorder, {
				raw: true,
				type: Sequelize.QueryTypes.UPDATE,
			})
		}
		else{
			sequelize
			.query("DELETE FROM orders WHERE idorder = "+req.body.idorder, {
				raw: true,
				type: Sequelize.QueryTypes.DELETE,
			})
		}
	});
})

app.post('/api/orders_to_pay', (req, res) => {
	sequelize
	.query("SELECT * from clients_orders_dishes WHERE state = 'cooked' and login = '" + req.body.login + "'", {
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then((result) => {
		if (result.length > 0) {
			res.json({body: result})
		}
		else{
			sequelize
			.query("SELECT * from clients_orders_dishes WHERE state = 'payed' and login = '" + req.body.login + "'", {
				raw: true,
				type: Sequelize.QueryTypes.SELECT,
			}).then((result) => {res.json({body: result})});
		}
	}
	);
})

app.post('/api/order_got', (req, res) => {
	sequelize
	.query("SELECT * from clients_orders_dishes WHERE state = 'payed' and idorder = " + req.body.idorder, {
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then((result) => {
		if (result.length === 0){
			sequelize
			.query("UPDATE orders SET state = 'got', update_time = NOW() WHERE idorder = "+req.body.idorder, {
				raw: true,
				type: Sequelize.QueryTypes.UPDATE,
			})
		}
		else{
			sequelize
			.query("DELETE FROM orders WHERE idorder = "+req.body.idorder, {
				raw: true,
				type: Sequelize.QueryTypes.DELETE,
			})
		}
	});
	}
)