# Entagk

Entagk is a web application for boosting your productivity using time blocking.

## Table of content

- [About](#about)
- [Features](#features)
- [Built with](#built-with)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Get started](#getting-started)
- [API Reference](#api-reference)
- [Issues](#Issues)
- [License](#license)

## About

- This app is based on the MongoDB database management system, Express.js web application framework, Node.js JavaScript runtime environment, and React.js front-end library.
- You can use this app for helping you to schedule your time using a to-do list and timer.
- The timer is working using the Pomodoro technique that breaks work into intervals, typically 25 minutes in length, separated by short breaks, typically 5 minutes, and after 4 intervals taking a long break of almost 15 minutes. Each interval is known as a Pomodoro.

- This repository contains Entagk backend only, Entagk frontend repository [here](https://github.com/MohamedAli00949/entagk-fontend).

### [Live demo](https://pomodoro-backend-6j65.onrender.com/)

## Features

- Timer
  - The ability to customize it.
  - Ticking audio.
  - Alarm audio.
  - Notifications.
- To-do list
- User authentication
  - Using email
  - Using Google login
  - Reset password using mail.
- Tasks Templates

## Built With

- [Node.js](https://nodejs.org/en/) - Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.
- [Exprees.js](https://expressjs.com/) - Express.js is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License.
- [MongoDB](https://www.mongodb.com/) - MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.
- [React.js](https://reactjs.org/) - React.js is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.
- [Redux.js](https://redux.js.org/) - Redux.js is an open-source JavaScript library for managing and centralizing application state. It is most commonly used with libraries for building user interfaces.

## Project Structure

```
├── __test__
|   ├── setting.test.js
|   ├── task.test.js
|   ├── templates.test.js
|   └── user.test.js
├── build
├── controllers
|   ├── sendMail.js
|   ├── setting.js
|   ├── task.js
|   ├── template.js
|   └── user.js
├── middlewares
|   ├── auth.js
|   ├── valdiateTimeAndAudioData.js
|   ├── validatePrivateTemplate.js
|   ├── validateTask.js
|   ├── validateTaskData.js
|   ├── validateTemplate.js
|   ├── validateTemplateData.js
|   └── VerifyResetToken.js
├── models
|   ├── resetId.js
|   ├── setting.js
|   ├── task.js
|   ├── template.js
|   └── user.js
├── routers
|   ├── setting.js
|   ├── task.js
|   ├── template.js
|   └── user.js
├── utils
|   └── helper.js
├── .env.example
├── .gitignore
├── index.js
├── LICENSE
├── pakage-lock.json
├── pakage.json
├── README.md
└── server.js
```

### Highlight Folders:

- `__test__` -- Contains all testing codes.
- `build` -- Contains all front-end files.
- `controllers` -- Contains all methods that process an endpoint.
- `middlewares` -- Contains all middlewares needed for the application in one place.
- `models` -- Contains all MongoDB models
- `routers` -- Contains all the routes that you have created using Express Router and what they do would be exported from a Controller file.

### Highlight Files:

- `.env.example` -- Contains required environment variables
- `server.js` -- Application entry end point
- `package.json` -- File which contains all the project npm details, scripts and dependencies.

## Prerequisites

- [Node.js](https://nodejs.org/en/) version 14+
- [Exprees.js](https://expressjs.com/) version 4+
- [MongoDB](https://www.mongodb.com/)

## Getting Started

1. **Clone the repository**

```
git clone https://github.com/MohamedAli00949/entagk-backend.git
```

```
cd entagk-backend
```

2. **Install dependencies**

```
npm install
```

3. **Run the project**

```
npm start
```

4. **Run test cases**

```
npm run test
```

## API Reference

Entagk API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns [JSON-encoded](http://www.json.org/) responses, and uses standard HTTP response codes and verbs. It also uses [JWT](https://jwt.io/) for authentication

### Base URL
```
https://pomodoro-backend-6j65.onrender.com/api/
```

### Endpoints
> Head over [Here](https://documenter.getpostman.com/view/16838332/2s8YsqUu1i) for Postman API documentation.

## Issues

If you have an issue, please open it in the issues tab and I will respond.

## License

> This software is licensed under MIT License, See [License](./LICENSE) for more information.
