# Shopify Summer 2019 Developer Intern Challenge
This is my repo for the backend developer intern challenge

## Description
I have written my API using nodejs with mongodb as my database. The API uses JWT tokens as authentication for users. The API allows users to purchase a single product at a time. Or users can create a cart and add or remove products to it. Once the user is done shopping they can checkout with their cart. The API documentation is written in the [swagger.yaml](swagger.yaml) file. I have also included a [postman collection](postman_collection/Shopify BE.postman_collection.json) with all then endpoints.
### Why node 
I chose to use nodejs because it allowed me to quickly create this small API. However if this API was roadmapped to be large I would have chosen a different language and framework (like golang or ruby on rails) which is easier to maintain at a larger size.  
### Why mongodb
I firstly chose to use a NoSQL database since I am not using relations when retreiving data (joins). Furthermore, I am assuming that there would be a large number of products stored in the database it would be easier to manage all the products with NoSQL (better scalability).

## Running the API
I am using a macbook.

To run the API locally you need to have node and npm installed. My versions are:
```
$ node -v
v8.12.0

$ npm -v
6.4.1
```
You also need a mongodb instance running locally. I have found the easiest way to do this is using docker:
```
$ docker -v
Docker version 18.09.0, build 4d60db4

$ docker run -p 27017:27017 -d mongo
```
The last step would be to copy the example .env file (dot_env_example):
```
$ cp dot_env_example .env
```
Now you can run the API!! At the root of the folder
```
$ npm i

$ node app.js
```
