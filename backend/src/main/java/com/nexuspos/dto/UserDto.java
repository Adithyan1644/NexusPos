package com.nexuspos.dto;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;
    private String initials;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String role, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.initials = computeInitials(name);
    }

    private String computeInitials(String fullName) {
        if (fullName == null || fullName.isBlank()) return "SA";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return fullName.substring(0, Math.min(2, fullName.length())).toUpperCase();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        this.initials = computeInitials(name);
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }
}
