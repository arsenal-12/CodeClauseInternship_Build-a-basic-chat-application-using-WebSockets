//client side
const socket=io()
const clientstotal=document.getElementById('clients-total')

socket.on('clients-total',(data)=>{
   clientstotal.innerHTML=`Total Clients:${data}`
})

const messageContainer=document.getElementById('message-container')
const messageInput=document.getElementById('message-input')
const messageForm=document.getElementById('message-form')
const nameInput=document.getElementById('name-input')
const msgaudio=new Audio("/excuse-me-boss-you-have-a-text-msg-notification-tone-43591.mp3")
messageForm.addEventListener('submit',(e)=>
{
    e.preventDefault()
    sendmessage()
})
function sendmessage(){
    if(messageInput.value==' ')return
    //console.log(messageInput.value)
    const data={
        name:nameInput.value,
        message:messageInput.value,
        dateTime:new Date()
    }
    socket.emit('message',data)
    addMessageToUI(true, data)
    messageInput.value = ''
}
//client sends
socket.on('chatmessage',(data)=>
{
    //console.log(data)
    addMessageToUI(false, data)
    msgaudio.play()

})

function addMessageToUI(isOwnMessage, data) {
    clearfeedback()
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
              </p>
          </li>
          `
  
    messageContainer.innerHTML += element
    scrollTobottom()
}
function scrollTobottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)

}
messageInput.addEventListener('focus',(e)=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing a message...`
  })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a message...`
})
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:``,
})
})

socket.on('feedback',(data)=>{
    clearfeedback()
const element=`<li class="message-feedback">
<p class="feedback" id="feedback">${data.feedback}</p>
</li>`
messageContainer.innerHTML+=element
})
function clearfeedback()
{
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentElement.removeChild(element)
    })
}

