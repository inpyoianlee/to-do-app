const client = require('./client')

const createToDoItem = async ({
    userid, 
    description, 
    datestart, 
    dateend, 
    timestart, 
    timeend
}) => {
    try {
        const {
            rows: [todoitem]
        }= await client.query(`
            INSERT INTO todoitems(userid, description, datestart, dateend, timestart, timeend)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, userid, description, datestart, dateend, timestart, timeend, allday;
        `, [userid, description, datestart, dateend, timestart, timeend])
        console.log(todoitem)
        return todoitem
    } catch (error) {
        throw error;
    }
}

const getToDoItemById = async (id) => {
    try {
        const {
            rows: [toDoItem]
        } = await client.query(`
            SELECT * FROM todoitems WHERE id=$1
        `, id)
        return toDoItem
    } catch (error) {
        throw error
    }
}

const getAllToDoItemsByUser = async (id) => {
    try {
        const {
            rows: [toDoItems]
        } = await client.query(`
            SELECT *
            FROM todoitems
            WHERE id=${id};
        `, [id])

        return toDoItems
    } catch (error) {
        throw error;
    }
}

const updateToDoItem = async (id, fields = {}) => {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}=$${index+1}`)
        .join(", ")
        
    try {
        if (setString.length > 0) {
            await client.query(`
                UPDATE todoitems
                SET ${setString}
                WHERE id=${id}
                RETURNING *;
            `, Object.values(fields))
        }

    } catch(error) {
        throw error;
    }
}

const deleteToDoItem = async (id) => {
    try {
        const {
            rows: [user]
        } = await client.query(`
            DELETE FROM todoitems
            WHERE id=$1;
        `, [id])

        return user
    } catch (error) { 
        throw error;
    }
}


module.exports = {
    createToDoItem, 
    getToDoItemById,
    getAllToDoItemsByUser, 
    updateToDoItem, 
    deleteToDoItem
}