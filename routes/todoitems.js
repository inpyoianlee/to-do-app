const todoitemsRouter = require('express').Router()
const {
    createToDoItem, 
    getToDoItemById,
    getAllToDoItemsByUser, 
    updateToDoItem, 
    deleteToDoItem
} = require('../db')

todoitemsRouter.get('/', (req, res) => {
    res.send({
        message: "to do items under construction!"
    })
})

module.exports = todoitemsRouter