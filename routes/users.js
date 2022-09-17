const usersRouter = require("express").Router()
const {
    getAllUsers,
    createUser,
    getUserByEmail,
    getUserByUsername,
    getUserById,
    updateUser,
    deleteUser,
} = require("../db");

usersRouter.get("/", async (req, res) => {
    res.send({
        message: "users api is under construction!"
    })
});

usersRouter.get('/all', async (req, res) => {
    try {
        const users = await getAllUsers()
        res.send(users)
    } catch (error) {
        console.log(error)
    }
})

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, password)
    // checking to see if the username or password is null
    if (!username || !password) {
        next({
            name: "Missing Credentials Error", 
            message: "Please provide both username and password"
        })
    }

    try {
        const user = await getUserByUsername({ username });
        if (!user) {
            next({
                name: "IncorrectCredentialsError", 
                message: "Username does not exist"
            })
        } else if(user.password !== password) {
            next({
                name: "IncorrectCredentialsError", 
                message: "Incorrect password"
            })
        } else {
            res.send({
                user: {id: user.id, username: user.username}, 
                message: `You are logged in ${user.username}!`
            })
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
})

usersRouter.post("/register", async (req, res, next) => {
    console.log(req.body)
    const { username, password, email } = req.body


    try {
        const existingUserByEmail = await getUserByEmail(email)
        const existingUserByUsername = await getUserByUsername(username)

        if (existingUserByEmail) {
            res.status(401)
            next({
                name: "EmailExistsError", 
                message: "A user under that email already exists"
            })
        }

        if (existingUserByUsername) {
            res.status(401)
            next({
                name: "UserExistsError", 
                message: "A user under that username already exists"
            })
        }

        if (!password) {
            next({
                name: "BlankPassword", 
                message: "Must provide a password"
            })
        }

        if (password.length < 5) {
            next({
                name: "PasswordTooShort", 
                message: "Password must be at least 5 characters long"
            })
        }

        try {
            const newUser = await createUser({ username, password, email })
            res.send({
                message: "User successfully created!", 
                user: newUser
            })
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
})

usersRouter.get("/:id", async (req, res) => {
    const {id} = req.params

    try {
        const user = await getUserById(id)
        res.send(user)
    } catch(error) {
        console.log(error)
    }
})

usersRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params
    
    const { username, email, password } = req.body
    const userObj = { username, email, password };
    // checks to see exactly what to update
    Object.keys(userObj).forEach((key) => {
        if (userObj[key] === undefined) {
            delete userObj[key]
        }
    })

    try {
        const result = await updateUser(id, userObj)
        res.send({
            message: "User successfully updated!", 
            updatedUser: result
        })
    } catch (error) {
        console.log(error)
    }
})

usersRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params

    try {
        const result = await deleteUser(id)
        res.send({
            message: "User successfully deleted!", 
            deletedUser: result
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = usersRouter