## commands

### create docker network
```bash
docker network create mongo-network
```

### start mongodb
```bash
docker run -d \
-p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=root
--network mongo-network \
--name mongodb
mongo
```

### start mongo-express
docker run -d \
-p ME_CONFIG_MONGODB_ADMINUSERNAME=root
-p ME_CONFIG_MONGODB_ADMINPASSWORD=root \
-e ME_CONFIG_MONGODB_SERVER=mongodb \
--network mongo-network \
--name mongo-express \
mongo-express
```