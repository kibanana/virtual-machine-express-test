const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24000 * 60 * 60,
    }
}))
app.use(cookieParser())

app.use(morgan('dev'))

const users = [
    { name: 'A', age: 11 },
    { name: 'B', age: 12 },
    { name: 'C', age: 11 }
]

app.get('/users', (req, res) => {
    res.send(JSON.stringify(users))
})

app.get('/users/:idx', (req, res) => {
    let { idx } = req.params

    if (isNaN(idx)) return res.status(400).send('ERR_INVALID_PARAM')
    if (users.length <= idx) return res.status(404).send('NOT_FOUND')

    res.send(users[idx])
})

app.post('/users', (req, res) => {
    const { name, age } = req.body

    if (!name || !age || isNaN(age)) return res.status(400).send('ERR_INVALID_PARAM')

    users.push({ name, age })

    res.send('success')
})

app.patch('/users/:idx', (req, res) => {
    let { idx } = req.params
    const { name } = req.params

    if (isNaN(idx) || !name) res.status(400).send('ERR_INVALID_PARAM')
    if (users.length <= idx) res.status(404).send('NOT_FOUND')

    users[idx].name = name

    res.send('success')
})

app.delete('/users/:idx', (req, res) => {
    let { idx } = req.params

    if (isNaN(idx)) res.status(400).send('ERR_INVALID_PARAM')
    if (users.length <= idx) res.status(404).send('NOT_FOUND')

    res.send('success')
})

app.get('/hi', (req, res) => {
    console.log('Hi!')

    res.send('success')
})

app.get('/hello', (req, res) => {
    console.log('Hello!')

    res.send('success')
})

app.get('warn', (req, res) => {
    console.warn('Test warning!')

    res.send('success')
})

app.get('error', (req, res) => {
    console.error('Test error!')

    res.send('success')
})
 
app.listen(process.env.PORT || 8080, () => {
    console.log('Server works!')
})