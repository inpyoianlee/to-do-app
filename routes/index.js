require('dotenv').config()
const apiRouter = require('express').Router();

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API IS UNDER CONSTRUCTION!", 
  });
});

const usersRouter = require('./users');
apiRouter.use("/users", usersRouter);

const todoitemsRouter = require('./todoitems')
apiRouter.use('/todoitems', todoitemsRouter)

module.exports = apiRouter;