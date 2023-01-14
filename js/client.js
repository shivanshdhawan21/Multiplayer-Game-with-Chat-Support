const socket=io('http://localhost:8000');
let emoji=document.getElementById('emoji');
const form=document.getElementById('sendBox');
const messageInp=document.getElementById('messageInput');
const messageContainer=document.querySelector(".chat_container");
const Container=document.querySelector(".container");
const audio=new Audio('extras/ting.mp3');
function reply_click()
{
    emoji=document.getElementById(event.srcElement.id);
}

//Tic Tac Toe Logic

const curr_date = new Date();
let month=curr_date.getMonth();
let turn,gameOver=false,turn_number=1,chances=9;
let getturn=()=>{}
turn="<img src='extras/christmas balls.png'/>"
document.body.style.backgroundImage="url('extras/christmas.jpg')";
getturn=(player)=> {
    return player===1?"<img src='extras/christmas balls.png'/>":"<img src='extras/candy cane.jpg'/>";
}
if(month==2) {
    turn="<img src='extras/balloon.jpg'/>"
    document.body.style.backgroundImage="url('extras/holi.jpg')";
    getturn=(player)=> {
        return player===1?"<img src='extras/balloon.jpg'/>":"<img src='extras/water_gun.jpg'/>";
    }
}
else if(month==9) {
    turn="<img src='extras/ladoo.jpg'/>"
    document.body.style.backgroundImage="url('extras/diwali.jpg')";
    getturn=(player)=> {
        return player===1?"<img src='extras/ladoo.jpg'/>":"<img src='extras/firecracker.jpg'/>";
    }
}
else if(month==10) {
    turn="<img src='extras/pumpkin.png'/>"
    document.body.style.backgroundImage="url('extras/haloween.jpg')";
    getturn=(player)=> {
        return player===1?"<img src='extras/pumpkin.png'/>":"<img src='extras/bone.jpg'/>";
    }
}
else if(month==11) {
    turn="<img src='extras/christmas balls.png'/>"
    document.body.style.backgroundImage="url('extras/christmas.jpg')";
    getturn=(player)=> {
        return player===1?"<img src='extras/christmas balls.png'/>":"<img src='extras/candy cane.jpg'/>";
    }
}
const append2=(id,turn2,player)=>{
    const image=document.getElementById(id);
    image.innerHTML = turn2;
    turn_number=turn_number===1?2:1;
    document.getElementById('info').innerText="Turn for Player "+player;
    turn = getturn(turn_number);
    checkWin();
    chances--;
    if(chances===0) {
        document.getElementById('info').innerText="Tie";
        button.disabled=false;
        button.style.cursor="pointer";
    }
}
const checkWin=()=>{
    let boxtext=document.getElementsByClassName('boxtext');
    let arr=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    arr.forEach(e=>{
        if((boxtext[e[0]].innerHTML===boxtext[e[1]].innerHTML)&&(boxtext[e[1]].innerHTML===boxtext[e[2]].innerHTML)&&(boxtext[e[0]].innerHTML!=='')) {
            if(turn_number===2) {
                document.getElementById('info').innerText="Player 1 won";
            }
            else {
                document.getElementById('info').innerText="Player 2 won";
            }
            gameOver=true;
            button.disabled=false;
            button.style.cursor="pointer";
        }
    })
}
let button=document.getElementById("button2");
button.addEventListener('click',function() {
    let boxtexts=document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(e=>{
        e.innerHTML='';
    })
    socket.emit("reset");
    game();
})
function game() {
    button.style.cursor="not-allowed";
    document.getElementById('info').innerText="Turn for Player "+turn_number;
    chances=9;
    button.disabled=true;
    let boxes=document.getElementsByClassName("box");
    Array.from(boxes).forEach(element=>{
        let boxtext=element.querySelector('.boxtext');
        element.addEventListener('click',()=>{
            if(boxtext.innerHTML==='') {
                boxtext.innerHTML=turn;
                turn_number=turn_number===1?2:1;
                checkWin();
                chances--;
                if(chances===0) {
                    document.getElementById('info').innerText="Tie";
                    button.disabled=false;
                    button.style.cursor="pointer";
                }
                else if(!gameOver) {
                    document.getElementById('info').innerText="Turn for Player "+turn_number;
                }
                socket.emit('chance',boxtext.id,boxtext.innerHTML,turn_number);
            }
        })
    })
}
game();

//Chat App Logic

emoji.addEventListener('click',(e)=>{
    const message=emoji.innerHTML;
    append(`You: ${message}`,'right');
    socket.emit('emojiInp',message);
})
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInp.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInp.value='';
})
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerHTML=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left') {
        audio.play();
    }
}
const name=prompt("Enter your name: ");
socket.emit('new-user-joined',name);
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right');
})
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left')
})
socket.on('left',name=>{
    append(`${name} left the chat`,'left');
})
socket.on('emojiInp',data=>{
    append(`${data.name}:${data.message}`,'left');
})
socket.on('your_chance',data=>{
    append2(`${data.id}`,`${data.turn}`,`${data.turn_number}`);
})
socket.on("reset_game",()=>{
    let boxtexts=document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(e=>{
        e.innerHTML='';
    })
    game();
})