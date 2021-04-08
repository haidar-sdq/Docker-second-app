const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

app.get("/", (_, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile-picture", (_, res) => {
	let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
	res.writeHead(200, { "Content-Type": "image/jpg" });
	res.end(img, "binary");
});

// use when starting application locally
const mongoUrlLocal = "mongodb://root:root@localhost:27017";

// use when starting application as docker container
const mongoUrlDocker = "mongodb://root:root@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
const databaseName = "my-db";

app.post("/update-profile", (req, res) => {
	let userObj = req.body;

	MongoClient.connect(mongoUrlDocker, mongoClientOptions, (err, client) => {
		if (err) throw err;
		const db = client.db(databaseName);
		const userID = 1;
		userObj = { ...userObj, userID };

		const myQuery = { userID };
		const newValues = { $set: userObj };

		db.collection("users").updateOne(
			myQuery,
			newValues,
			{ upsert: true },
			(err, _) => {
				if (err) throw err;
				client.close();
			}
		);
	});
	// Send response
	res.send(userObj);
});

app.get("/get-profile", (_, res) => {
	let response = {};
	// Connect to the db
	MongoClient.connect(mongoUrlDocker, mongoClientOptions, (err, client) => {
		if (err) throw err;

		const db = client.db(databaseName);

		const myQuery = { userID: 1 };

		db.collection("users").findOne(myQuery, (err, result) => {
			if (err) throw err;
			console.log("=======================>", result);
			response = { ...result };
			client.close();

			// Send response
			res.send(response);
		});
	});
});

app.listen(3000, () => console.log("app listening on port 3000!"));
