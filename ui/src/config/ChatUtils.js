export const getSenderName = (usersList, loggedInUser) => {
  return usersList[0]._id === loggedInUser._id
    ? usersList[1].userName
    : usersList[0].userName;
};
export const getSenderInfo = (usersList, loggedInUser) => {
  return usersList[0]._id === loggedInUser._id ? usersList[1] : usersList[0];
};
export const getConfig = (user) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
};
export const getPosition = (message, userId) => {
  return message.sender._id === userId ? "right" : "left";
};
export const isSameSender = (message, index, userId, allMessages) => {
  const first = console.log(
    (index < allMessages.length - 1 &&
      allMessages[index + 1].sender._id !== message.sender._id) ||
      (allMessages[index + 1] === undefined &&
        allMessages[index].sender !== userId)
  );
  return (
    (index < allMessages.length - 1 &&
      allMessages[index + 1].sender._id !== message.sender._id) ||
    (allMessages[index + 1] === undefined &&
      allMessages[index].sender._id !== userId)
  );
};
export const isLastMessage = (allMessages, index, userId) => {
  const sec =
    index === allMessages.length - 1 &&
    allMessages[allMessages.length - 1].sender._id &&
    allMessages[allMessages.length - 1].sender._id !== userId;
  console.log("sec", sec);
  return (
    index === allMessages.length - 1 &&
    allMessages[allMessages.length - 1].sender._id &&
    allMessages[allMessages.length - 1].sender._id !== userId
  );
};
export const showAvatar = (message, allMessages, index, userId) => {
  const show =
    (index < allMessages.length - 1 &&
      message.sender._id !== userId &&
      allMessages[index + 1].sender._id !== message.sender._id) ||
    (index === allMessages.length - 1 &&
      allMessages[index].sender._id !== userId);
  console.log(message.content, show);
  return show;
};
export const getBgColor = (message, userId) => {
  return message.sender._id === userId ? "#BEE3F8" : "#B9F5D0";
};
export const getSenderMarginLeft = (message, userId) => {
  return message.sender._id === userId ? "70%" : "0";
};
export const isSameUser = (messages, message, index) => {
  return (
    index > 0 &&
    messages[index + 1] &&
    messages[index + 1].sender._id === message.sender._id
  );
};
