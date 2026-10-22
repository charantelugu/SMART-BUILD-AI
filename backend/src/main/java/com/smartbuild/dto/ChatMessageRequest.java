package com.smartbuild.dto;

import java.util.Map;

public class ChatMessageRequest {
    private String message;
    private Map<String, Object> projectContext;

    public ChatMessageRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Map<String, Object> getProjectContext() { return projectContext; }
    public void setProjectContext(Map<String, Object> projectContext) { this.projectContext = projectContext; }
}
