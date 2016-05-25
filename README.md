## HSE manager for works

#### Running locally
```sh
# Install the dependencies
$ npm install

# Start the server
$ npm start
```

#### Deploying to Apache
```sh
$ sudo ./toweb.sh
```

#### Deploying to gcloud
```sh
# Get gcloud
$ curl https://sdk.cloud.google.com | bash

# Authorize gcloud and set your default project
$ gcloud auth login
$ gcloud config set project $PROJECT_ID

# Get App Engine component
$ gcloud components update app

# Deploy the app to production
$ gcloud preview app deploy app.yaml
$ curl -X GET http://$PROJECT_ID.appspot.com
```

## Resources

- [Example 1](//github.com/GoogleCloudPlatform/gcloud-node-todos)
- [Example 2](https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart)
- [Example 3](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/hello-world)
- [Apache](https://www.youtube.com/watch?v=KzJxwu2poIc)
