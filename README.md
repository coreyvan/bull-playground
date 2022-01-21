# bull-playground
Experiments with Typescript + BullMQ for message queuing

# Run redis
Make sure an instance of redis is running on localhost:6380

# Run the example API
```shell
yarn run server
```
This should start the server running on port 3000

# Run a worker
```shell
yarn run worker [type]
```
This will run an example worker of [type]. Type can be empty for a default worker or one of: `sleepy`, `concurrent` or `faulty`