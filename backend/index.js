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
	.query("SELECT * from get_clients_orders_dishes_by_login('" + req.body.login + "')", { /// TABLE FUNCTION and VIEW are used
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then(search_result=>{
		sequelize
		.query("SELECT * FROM dishes", {
			raw: true,
            type: Sequelize.QueryTypes.SELECT,
		}).then(dishes => res.json({data: dishes, unfinished_orders: search_result.length != 0}))
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
	sequelize
	.query("CALL register_user('" + req.body.login + "', '" + req.body.password + "', 'client')")
  	.then(()=>{
    client.findOne({where:{login: req.body.login, password: req.body.password}}).then(clients=>{ //ORM is used
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
	sequelize
	.query("SELECT * FROM create_order()", {raw: true,
	type: Sequelize.QueryTypes.SELECT,})
	.then(creating_result=>{
		let idorder=creating_result[0].create_order;
		for (let i=0; i < req.body.dishes.length; i++)
		{
			sequelize
			.query("CALL create_dish_order('"+idorder+"', '"+req.body.dishes[i]+"')")
		}
	sequelize
			.query("CALL add_order_to_client('"+req.body.login+"', '"+idorder+"')")
	})
})

app.get('/api/orders', (req, res) => {
  sequelize
    // .query("SELECT * FROM clients_orders_dishes WHERE state = 'received' ", {
	.query("select * from clients_orders_dishes as cod join dishes_products dp on cod.dish = dp.dish  join products on dp.product = products.product WHERE state = 'received'",{
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => res.json({data: result}));
  });

  app.post('/api/order_ready', (req, res) => {
	sequelize
	.query("CALL change_order_state("+req.body.idorder+", 'cooked')");
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

  app.post('/api/order_payed', (req, res) => {
	sequelize
	.query("SELECT * from clients_orders_dishes WHERE state = 'got' and idorder = " + req.body.idorder, {
		raw: true,
		type: Sequelize.QueryTypes.SELECT,
	})
	.then((result) => {
		if (result.length === 0){
			sequelize
			.query("CALL change_order_state("+req.body.idorder+", 'payed')");
		}
		else{
			sequelize
			.query("CALL delete_order("+req.body.idorder+")");
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
			.query("CALL change_order_state("+req.body.idorder+", 'got')");
		}
		else{
			sequelize
			.query("CALL delete_order("+req.body.idorder+")");
		}
	});
	}
)

app.get("/api/orders_all", (req, res) => {
	sequelize
    .query("SELECT * FROM clients_orders_dishes", {
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => res.json({data: result}));
})

app.post("/api/add_user", (req, res) => {
	sequelize
	.query("CALL register_user('" + req.body.login + "', '" + req.body.password + "', '"+req.body.role+"')")
})

app.get("/api/users", (req, res) => {
	sequelize
    .query("SELECT * FROM clients", {
        raw: true,
        type: Sequelize.QueryTypes.SELECT,
    })
    .then((result) => {res.json({data: result})});
})

app.post("/api/delete_user", (req, res) => {
	sequelize
    .query("CALL delete_user(" + req.body.id + ")")
})

app.post("/api/delete_order", (req, res) => {
	sequelize
	.query("CALL delete_order("+req.body.idorder+")");
})