import React, { useState } from "react";
import "./App.css";



const App = () => {


const protocol = 'ws://';
const socket = new WebSocket(protocol.concat("localhost:8000/"))
let text = "";

socket.onopen = e => {
  console.log('open', e)
}

socket.onerror = e => {
  console.log('error', e)
}

socket.onmessage = e => {
  text = e.data;
  console.log(e.data);
}



  return(<div><p>{text}</p></div>)
}
export default App;
