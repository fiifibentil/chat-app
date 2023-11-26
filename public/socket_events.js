const socket = io()
socket.on('connect',()=>{
    console.log('I connected to the server')
})

socket.on('onTotalClientChange',(data)=>{
    let total_clients = document.getElementById('totalClients')
    total_clients.innerHTML = data.totalClients
})

const send_button = document.getElementById('sendMessageButton')
const name_input_field = document.getElementById('nameInputField')
const message_list = document.getElementById('messageList')
const message_input_field = document.getElementById('messageInput')

function AddMessageToUI (own_message,data) {
    const element = `
      <li class="${own_message ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.textMessage}
            <span>${data.userName} ● ${moment(data.textTime).fromNow()}</span>
          </p>
        </li>
        `
    message_list.innerHTML += element
    scrollToBottom()
}

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
}

function scrollToBottom() {
    message_list.scrollTo(0, message_list.scrollHeight)
}

function sendMessage(){
    let message_input = message_input_field.value
    let user_name = name_input_field.value
    if (message_input == null || message_input == ''){
        return
    }
    const data = {
        textMessage:message_input,
        textTime:new Date(),
        userName: user_name
    }
    socket.emit('clientTextMessageSent',data)
    message_input_field.value = ''
    AddMessageToUI(true,data)
}  

send_button.addEventListener('click',()=>{
    sendMessage()
})

name_input_field.addEventListener('input',(event)=>{
    name_input_field.value = event.target.value
})

message_input_field.addEventListener('keyup', (event)=>{
    if (event.key === "Enter") {
        sendMessage()
    }
})

message_input_field.addEventListener('focus', ()=>{
    socket.emit('feedback',{feedback:'✍️ '+name_input_field.value+' is typing a message'})
})
message_input_field.addEventListener('keypress', ()=>{
    socket.emit('feedback',{feedback:'✍️ '+name_input_field.value+' is typing a message'})
})
message_input_field.addEventListener('blur', ()=>{
    socket.emit('feedback',{feedback:'',})
})

socket.on('serverTextMessageBroadcast', (data)=>{
    AddMessageToUI(false,data)
})

socket.on('feedback', (data)=>{
    clearFeedback()
    const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  message_list.innerHTML += element
})