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
            rows: [toDoItem]
        } = await client.query(`
            INSERT INTO todoitems(userid, description, datestart, dateend, timestart, timeend)
            VALUES($1, $2, $3, $4, $5, $6);
        `, [userid, description, datestart, dateend, timestart, timeend])
    } catch (error) {
        throw error;
    }
}