import { Messages } from "../models/messagesSchema.js";
import { Chats } from "../models/chatSchema.js";

export const getMessages = async (req, res) => {
  try {

    const { chatId } = req.params;

    const messages = await Messages.find({
      chats: chatId,
    })
      .populate("sender", "name email")
      .populate("chats");

    return res.status(200).json(messages);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
};
export const sendMessage = async (req, res) => {
  try {

    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        message: "chatId and content required",
      });
    }

    // CREATE MESSAGE

    const newMessage = await Messages.create({
      sender: req.user.id,
      chats: chatId,
      content,
    });

    // POPULATE MESSAGE

    const populatedMessage = await Messages.findById(
      newMessage._id
    )
      .populate("sender", "name email")
      .populate("chats");

    // UPDATE LATEST MESSAGE

    await Chats.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id,
    });

    return res.status(201).json(populatedMessage);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};