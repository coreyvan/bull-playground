# bull-playground
Experiments with Typescript + BullMQ for message queuing

# Run redis
Make sure an instance of redis is running.

# Run the example API
```shell
yarn run server [redis host] [redis port]
```
This should start the server running on port 3000 using redis at the specified host and port (if blank, default localhost:6380)

# Run a worker
```shell
yarn run worker [type]
```
This will run an example worker of [type]. Type can be empty for a default worker or one of: `sleepy`, `concurrent` or `faulty`