import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import "./App.css";

const socket = io("http://localhost:5000");
const SECRET_KEY = "quantum-secret-key";

function App() {

  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");

  const bottomRef = useRef();

  useEffect(() => {

    socket.on("receiveMessage", (data) => {

      const bytes = CryptoJS.AES.decrypt(data.text, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      setMessages((prev) => [
        ...prev,
        { ...data, text: decrypted }
      ]);
    });

    socket.on("updateSeen", () => {
      setMessages((prev) =>
        prev.map((m) => ({ ...m, status: "seen" }))
      );
    });

    socket.on("users", (list) => setUsers(list));

    socket.on("showTyping", (name) => {
      setTyping(name + " is typing...");
      setTimeout(() => setTyping(""), 2000);
    });

    return () => socket.off();

  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.emit("seen");   // mark seen
  }, [messages]);

  const joinChat = () => {
    if (tempName) {
      setUsername(tempName);
      socket.emit("join", tempName);
    }
  };

  const sendMessage = () => {

    if (message) {

      const encrypted = CryptoJS.AES.encrypt(
        message,
        SECRET_KEY
      ).toString();

      socket.emit("sendMessage", {
        user: username,
        text: encrypted,
        time: new Date().toLocaleTimeString(),
        status: "delivered"
      });

      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", username);
  };

  if (!username) {
    return (
      <div className="login">
        <h2>Enter your name</h2>
        <input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  return (
    <div className="container">

      <div className="users">
        <h3>Online</h3>
        {users.map((u) => (
          <p key={u.id}>{u.name}</p>
        ))}
      </div>

      <div className="chat">
        <h3>Welcome {username}</h3>

        <div className="messages">

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.user === username ? "my" : "other"}
            >
              <small>
                {m.user} • {m.time}
                {m.user === username &&
                  <span>
                    {m.status === "seen" ? " ✔✔" : " ✔"}
                  </span>
                }
              </small>

              <p>{m.text}</p>
            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        <p className="typing">{typing}</p>

        <div className="input">
          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
