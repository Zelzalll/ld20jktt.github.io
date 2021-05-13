import Peer from 'peerjs'
const {uid} = require('uid');
const $ = require('jquery');
const config = {host: 'realtime-livestream.herokuapp.com', port: 443, secure: true, key: 'peerjs'}
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');

console.log(io)

const socket = io('https://livestream1205.herokuapp.com/');


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

socket.emit('NEW_PEER_ID',peerId);
socket.on('ONLINE_PEER_ARRAY', arrPeerId=>{
      arrPeerId.forEach(id => {
          $('#ulPeerId').append(`<li id="${id}">${id}</li>`);
      });
})

socket.on('SOMEONE_DISCONNECTED', peerId => {
    $(`#${peerId}`).remove();
});

socket.on('NEW_CLIENT_CONNECT', id => $('#ulPeerId').append(`<li id="${id}">${id}</li>`));
  
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



