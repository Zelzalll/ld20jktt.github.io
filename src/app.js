import Peer from 'peerjs'
const {uid} = require('uid');
const $ = require('jquery');
const config = {host: 'realtime-livestream.herokuapp.com', port: 443, secure: true, key: 'peerjs'}
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');


const socket = io('https://livestream1405.herokuapp.com/');

//const socket = io('http://localhost:3005')

console.log(socket)
function getPeer()
{
    const id = uid(10);
    $('#peer-id').append(id);
    return id;
}
const peerId = getPeer();
const peer = new Peer(peerId,config); 
/*$('#btnCall').click(() =>{
    const friendId = $('#txtFriendId').val();
    openStream(stream =>{
        playVideo(stream,'localStream');
        const call = peer.call(friendId, stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'));
        });
});
*/

const arrMsg=[];

socket.emit('NEW_PEER_ID',peerId);
socket.on('ONLINE_PEER_ARRAY', arrPeerId=>{
      arrPeerId.forEach(id => {
        $('#ulchat').append(`<p class="user-joined">${id} joined</p>`);
        $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
      });
})

socket.on('SOMEONE_DISCONNECTED', peerId => {
    $(`#${peerId}`).remove();
});

socket.on('NEW_CLIENT_CONNECT', id => {
    $('#ulchat').append(`<p class="user-joined">${id} joined</p>`);
    $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
});
  
var numberid = 0;
$('#ulPeerId').on('click','li',function(){
    numberid = numberid +1;
    var friendStream = numberid.toString();
    var video = document.createElement("video");
    video.setAttribute('id',friendStream);
    video.width = 300;
    video.controls = true;
    var element = document.getElementById("video");
    element.appendChild(video);
    const peerId = $(this).text();
    openStream(stream =>{
        playVideo(stream,'localStream');
        const call = peer.call(peerId, stream);
        call.on('stream',remoteStream => playVideo(remoteStream,friendStream));
        });
});

peer.on('call', (call) => {
    var friendStream = numberid.toString();
    var video = document.createElement("video");
    video.setAttribute('id',friendStream);
    video.width = 300;
    video.controls = true;
    var element = document.getElementById("video");
    element.appendChild(video);
    openStream(stream =>{
        playVideo(stream,'localStream');
        call.answer(stream);
        call.on('stream',remoteStream => playVideo(remoteStream,friendStream));
        });
  });

$('#submit-msg').on('click', function(){
    var arrmsg=[]
    let msg1 = document.getElementById("enter-msg").value;
    arrmsg.push(msg1);
    arrmsg.push(peerId);
    socket.emit("Client-send-data",arrmsg);
})

socket.on("Server-send-data",function(data){

    document.getElementById("enter-msg").value ="";
    var div = document.createElement("div")
    var p1 = document.createElement("p");
    if(data[1]==peerId)
    {
        p1.innerHTML="You";
        div.setAttribute('class',"You-join");
    }
    else
    {
        p1.innerHTML=data[1];
        div.setAttribute('class',"Other-join");

    }
    var p2 = document.createElement("p");
    p1.setAttribute('class','joiner-name')
    p2.setAttribute('class','msg-content')
    p2.innerHTML = data[0];
    div.appendChild(p1);
    div.appendChild(p2);
    $('#ulchat').append(div);
})





