export const getSenderName = (usersList, loggedInUser) => {
  return usersList[0]._id === loggedInUser._id
    ? usersList[1].userName
    : usersList[0].userName;
};
