const express = require('express')
const path = require('path')
const port = process.env.port || 3000
const app = express()
app.use(express.static(path.join(__dirname,'public')))
const server = app.listen(port, ()=>{console.log('express app is running on port: ', port)})

const io = require('socket.io')(server)
let total_clients = 0

io.on('connection', (socket)=>{
    total_clients ++;
    io.sockets.emit('onTotalClientChange',{totalClients:total_clients})

    socket.on('clientTextMessageSent',(data)=>{
        socket.broadcast.emit('serverTextMessageBroadcast',data)
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })

    socket.on('disconnect',(socket)=>{
        total_clients --;
        io.sockets.emit('onTotalClientChange',{totalClients:total_clients})
    })
})
