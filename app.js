//server
const express=require('express')
const app=express() //creates app
const PORT=5000          //port number
const server=app.listen(PORT,()=> console.log(`Server on port ${PORT}`))

const io=require('socket.io')(server)

const path=require('path')
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath))  //This line defines the path to your "public" directory by using the path.join method. __dirname is a global variable that represents the current directory of the JavaScript file in which it is used.

let socketConnected=new Set()

io.on('connection',(onConnected))
function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id)
io.emit('clients-total',socketConnected.size)   

socket.on('disconnect',()=>{
    console.log('socket disconnected',socket.id)
    socketConnected.delete(socket.id)
    io.emit('clients-total',socketConnected.size)   
})    

socket.on('message',(data)=>{
    //console.log(data)
    socket.broadcast.emit('chatmessage',data)
})
socket.on('feedback',(data)=>{
socket.broadcast.emit('feedback',data)
})
}