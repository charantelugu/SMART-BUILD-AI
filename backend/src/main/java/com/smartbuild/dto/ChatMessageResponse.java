package com.smartbuild.dto;

public class ChatMessageResponse {
    private String reply;
    private String timestamp;

    public ChatMessageResponse() {}

    public ChatMessageResponse(String reply, String timestamp) {
        this.reply = reply;
        this.timestamp = timestamp;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
