const client = require("./client")
const { createUser } = require('./users')
const { createToDoItem } = require('./todoitems')

async function buildTables() {
    try {
        client.connect()

        await client.query(`
            DROP TABLE IF EXISTS todoitems;
            DROP TABLE IF EXISTS users;
        `)

        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY, 
                username VARCHAR(255) UNIQUE NOT NULL, 
                password VARCHAR(255) NOT NULL, 
                email VARCHAR(255) UNIQUE NOT NULL, 
                isadmin BOOLEAN DEFAULT false
            ); 

            CREATE TABLE todoitems(
                id SERIAL PRIMARY KEY, 
                userid INTEGER REFERENCES users(id), 
                description VARCHAR(255), 
                datestart DATE NOT NULL, 
                dateend DATE NOT NULL, 
                timestart TIME, 
                timeend TIME
            );
        `)
    } catch (error) {
        throw error;
    }
}

async function populateInitialData() {
    try {
        console.log("creating users: ")
        const usersToCreate = [
            { username: "ian", password: "password", email: "inpyoianlee@gmail.com", isAdmin: "true" },
            { username: "sandra", password: "sandra123", email: "sandra@123.com" },
            { username: "glamgal", password: "glamgal123", email: "glamgal@123.com" },
        ];

        const users = await Promise.all(usersToCreate.map(createUser));
        console.log("users created!")
        console.log(users)
        console.log("Finished creating users!")

        const toDoItemsToCreate = [
            { 
                userid: 1, 
                description: "test to do item", 
                datestart: '2022-09-22', 
                dateend: '2022-09-22', 
                timestart: '08:00:00', 
                timeend: '10:00:00'
            }, 
            {
                userid: 1, 
                description: "this is the second to do item", 
                datestart: '2022-09-30', 
                dateend: '2022-09-31', 
                timestart: '12:00:00', 
                timeend: '14:00:00'
            }
        ]

        const toDoItems = await Promise.all(toDoItemsToCreate.map(createToDoItem))
        console.log("to do items created!")
        console.log(toDoItems)
        console.log("Finished creating to do items!!")
    } catch (error) {
        throw error;
    }
}