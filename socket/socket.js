import { Chats } from "../api/models/chatSchema.js";
import { Messages }from "../api/models/messagesSchema.js"
export const setupSocket = (io)=>{
    io.on("connection", (socket)=>{
     console.log("user connected", socket.id)

      socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    
 // create message
    socket.on("send_message", async (data) => {
      try {
        const { sender, content, chatId} = data;
        let newMessages = await Messages.create({
        sender,
        content,
        chats: chatId,
        });

         newMessages = await newMessages.populate("sender","userName email")
         newMessages = await newMessages.populate("chats")

        // Update last message in Chat
        await Chats.findByIdAndUpdate(chatId, {
            latestMessage: newMessages._id,
        });

        io.to(chatId).emit("receive_message", newMessages);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
   socket.on("disconnected",()=>{
        console.log("user disconnected", socket.id)
        })
    })
}




