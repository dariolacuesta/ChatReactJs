import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import video from "./assets/bck.mp4";
import img1 from "./assets/1.png";
import img2 from "./assets/2.png";
import img3 from "./assets/3.png";
import img4 from "./assets/4.png";
import img5 from "./assets/5.png";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// const socket = io();
const socket = io("http://localhost:3001");
function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nickname, setNickName] = useState("");
  const [avatar, setAvatar] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  const saveNickName = (e) => {
    e.preventDefault();
    const name = document.getElementById("username").value;
    console.log(
      `Welcome %c${nickname}`,
      "color:green;font-size:1.2rem;font-weight:bold"
    );
    socket.emit("join-chat", name);
    setNickName(name);
  };

  const logout = () => {
    setNickName("");
  };
  const handleChangeAvatar = (e) => {
    setAvatar(e.target.value);
  };

  useEffect(() => {
    const receivMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on("message", receivMessage);
    return () => {
      socket.off("message", receivMessage);
    };
  }, [messages]);

  return (
    <>
      <div className="h-screen bg-zinc-800 text-white flex items-center justify-center main">
        <video
          className="container__video"
          src={video}
          autoPlay
          loop
          muted
        ></video>
        <div className="content">
          {nickname === "" ? (
            <form
              className="bg-zinc-900 p-10 w-80 h-90 container mx-auto rounded-lg border-2 border-green-600"
              onSubmit={saveNickName}
            >
              <h1 className="text 2x1 font-bold my-2 text-center">
                Join the ReactJSChat
              </h1>
              <InputLabel
                className="text 2x1 font-bold my-2 text-zinc-50 justify-center flex"
                id="demo-simple-select-label"
              >
                <p className="text 2x1 font-bold my-2 text-zinc-50 text-center">
                  Choose an Avatar
                </p>
              </InputLabel>
              <div className="flex justify-center">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  className="border-2 border-lime-500"
                  value={avatar}
                  label="Age"
                  onChange={handleChangeAvatar}
                >
                  <MenuItem value={img1}>
                    <img src={img1} width={25} height={25}></img>
                  </MenuItem>
                  <MenuItem value={img2}>
                    <img src={img2} width={25} height={25}></img>
                  </MenuItem>
                  <MenuItem value={img3}>
                    <img src={img3} width={25} height={25}></img>
                  </MenuItem>
                  <MenuItem value={img4}>
                    <img src={img4} width={25} height={25}></img>
                  </MenuItem>
                  <MenuItem value={img5}>
                    <img src={img5} width={25} height={25}></img>
                  </MenuItem>
                </Select>
              </div>
              <p className="text 2x1 font-bold my-2 text-zinc-50 text-center">
                Type your nickname
              </p>
              <input
                type="text"
                className="border-2 border-zinc-500 p-2 text-black w-full"
                id="username"
                name="username"
                // onChange={(e) => setNickName(e.target.value)}
                required
              ></input>
              <div className="justify-center flex">
                <button
                  type="submit"
                  className="my-5 w-20 ring-2 ring-lime-500 text-lime-500  rounded-lg transition ease-in-out delay-150 bg-zinc-800 hover:-translate-y-1 hover:scale-110 hover:bg-lime-500 hover:text-slate-50 duration-300"
                >
                  Ingresar
                </button>
              </div>
              <div className="text-center text-lime-500">
                This is the nickname that will be displayed
              </div>
            </form>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-10 w-80 rounded-lg border-2 border-green-600"
              >
                <div className="flex flex-row justify-center items-center border-2 border-lime-500 rounded-lg mb-5">
                  <div>
                    <img src={`${avatar}`} width={25} height={25}></img>
                  </div>
                  <h1 className="text-2x1 font-bold my-2 text-center pl-5 ">
                    {`Welcome ${nickname}`}
                  </h1>
                </div>
                <input
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  className="border-2 border-zinc-500 p-2 text-black w-full"
                ></input>
                <div className="justify-center flex">
                  <button className="my-5 w-20 ring-2 ring-lime-500 text-lime-500  rounded-lg transition ease-in-out delay-150 bg-zinc-800 hover:-translate-y-1 hover:scale-110 hover:bg-lime-500 hover:text-slate-50 duration-300">
                    Enviar
                  </button>
                </div>
                <ul className="h-60 overflow-y-auto">
                  {messages.map((message, index) => (
                    <li
                      key={index}
                      className={`my-2 p-2 table text-sm rounded-md mr-2 ${
                        message.from === "Me"
                          ? "bg-lime-700 ml-auto"
                          : "bg-cyan-500"
                      } ${message.from === "Bot" && "bg-purple-400"}`}
                    >
                      <p>
                        {message.from}:{message.body}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="justify-center flex">
                  <button
                    onClick={logout}
                    className="my-5 w-20 ring-2 ring-red-500 text-red-500  rounded-lg transition ease-in-out delay-150 bg-zinc-800 hover:-translate-y-1 hover:scale-110 hover:bg-red-500 hover:text-slate-50 duration-300"
                  >
                    Logout
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
