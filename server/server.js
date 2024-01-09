const PORT = process.env.PORT || 8000;
const express = require('express');
const {v4: uuidv4} = require('uuid');
const app = express();
const pool = require('./db.js');
const cors = require('cors');
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// get all todos
app.get('/todos/:id', async (req,res)=>{
    try {
        const userEmail = req.params.id; 

        const todos = await pool.query('SELECT * FROM  todos where user_email = $1', [userEmail]);
        res.json(todos.rows);
        
    } catch (error) {
        console.log(error);
    }
})

// create a new todo
app.post('/todos', async (req,res)=>{
    try {
        // console.log(req.body);
        const {user_email, title, progress, date} = req.body;
        const id = uuidv4();
        
        const newTodo = await pool.query('INSERT INTO todos(id ,user_email, title, progress, date) VALUES($1, $2, $3, $4, $5 )', [id,user_email, title, progress, date]);
        res.json(newTodo);
    } catch (error) {
        console.log(error)
    }
})

// edit a todo
app.put('/todos/:id',async(req,res)=>{
    const {id} = req.params;
    const {user_email, title, progress, date} = req.body;
    try {
        const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id=$5',[user_email, title, progress, date,id])
        // console.log(editToDo);
        res.json(editToDo);
    } catch (error) {
        console.log(error)
    }
})

// delete a todo
app.delete('/todos/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        const deleted=await pool.query("DELETE from todos WHERE id=$1",[id]);
        res.json(deleted);
    }catch(error){
        console.log(error);
    }
})

app.post('/signup', async (req,res)=>{
    try {
        const {email, password} = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const signup = await pool.query(`INSERT INTO users(email, hashed_password) VALUES($1, $2)`,[email,hashPassword]);
        const token = jwt.sign({email},'secret', {expiresIn: '1hr'});
        res.json({email, token});
    } catch (error) {
        console.log(error)
        if(error){
            res.json({detail: error.detail})
        }
    }
})

app.post('/login', async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        if(!user.rows.length){
            return res.json({detail: 'User Does\'nt Exists !'})
        }
        // console.log(user);

        const success =bcrypt.compare(password, user.rows[0].hashed_password)
        const token = jwt.sign({email},'secret', {expiresIn: '1hr'});

        if (!success) {
            res.json({detail: `Wrong password for email ${email}`})
        }else{
            res.json({
                email: user.rows[0].email,
                token
            })
        }
    } catch (error) {
        console.log(error)
    }
})
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})