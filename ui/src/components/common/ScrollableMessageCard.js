import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";
import {
  getBgColor,
  getPosition,
  getSenderMarginLeft,
  isLastMessage,
  isSameSender,
  isSameUser,
  showAvatar,
} from "../../config/ChatUtils";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableMessageCard = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages.map((msg, idx) => {
        return (
          <div
            key={msg._id}
            style={{
              display: "flex",

              margin: "2px",
            }}
          >
            {showAvatar(msg, messages, idx, user._id) && (
              <Tooltip
                label={msg.sender.userName}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  size={"sm"}
                  mt={2}
                  mr={1}
                  cursor={"pointer"}
                  name={msg.sender.userName}
                  src={msg.sender.profilePic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: getBgColor(msg, user._id),
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",

                marginLeft: getSenderMarginLeft(msg, user._id),
                marginBottom: isSameUser(messages, msg, idx) ? "3px" : "10px",
              }}
            >
              {msg.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableMessageCard;
