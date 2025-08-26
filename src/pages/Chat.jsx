import '../style/pages/chat.css';
import ChatUsers from '../components/ChatUsers';
import ChatTextArea from '../components/ChatTextArea';


const Chat = () => {

  return (
    <div>
      <div className="chat-task-wrapper">
        <div className="slider">
          <ChatUsers />
        </div>
        <div className="text">
          <ChatTextArea />

        </div>
      </div>
    </div>
  )
}

export default Chat
