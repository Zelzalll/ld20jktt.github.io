import Peer from 'peerjs'
const {uid} = require('uid');
const $ = require('jquery');
const config = {host: 'realtime-livestream.herokuapp.com', port: 443, secure: true, key: 'peerjs'}
const openStream = require('./openStream');
const playVideo = require('./playVideo');


function getPeer()
{
    const id = uid(10);
    $('#peer-id').append(id);
    return id;
}
const peer = new Peer(getPeer(),config); 

$('#btnCall').click(() =>{
    const friendId = $('#txtFriendId').val();
    openStream(stream =>{
        playVideo(stream,'localStream');
        const call = peer.call(friendId, stream);
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'));
        });
});

peer.on('call', function(call) {
    openStream(stream =>{
        playVideo(stream,'localStream');
        call.answer(stream);
        call.on('stream',remoteStream => console.log('GOT A NEW STREAM'));
        });
  });


