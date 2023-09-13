# udemy-web-dev-todolist
A concept of a todo list app for registering common tasks, with a couple of lists for different types of tasks. This webapp was bult using NodeJS, ExpressJS, Mongoose and MongoDB. 

The project is based on a capstone project from Udemy's "The Complete 2023 Web Developer Bootcamp", created by the App Brewery team.

## First Setup

First, clone this project onto your local machine:

```
$ git clone https://github.com/GSAprod/udemy-web-dev-todolist.git
```

Then, install all node dependencies such as `express`, `mongoose`, etc.

```
$ npm i
```

### Running the project

Make sure you have Docker installed and running on your computer.

Start the MongoDB container with the [Docker Compose]('./docker-compose.yaml') file. 
This will also create a persistent volume inside Docker's `/var/lib/docker/volume` directory. 

```
$ docker compose up --detach
```

Finally, start the project's frontend and backend using node:

```
$ npm run dev
```

## Resources used

Icons by [heroicons.com](https://heroicons.com)

Background pattern by [Robogiek on Toptal's Subtle Patterns page](https://www.toptal.com/designers/subtlepatterns/interlaced/)