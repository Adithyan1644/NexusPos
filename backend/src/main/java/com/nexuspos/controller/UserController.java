package com.nexuspos.controller;

import com.nexuspos.dto.UserDto;
import com.nexuspos.model.User;
import com.nexuspos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getStatus()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        String password = body.get("password");
        String role = body.get("role");

        if (email == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and Email are required"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "User with this email already exists"));
        }

        String rawPass = (password != null && !password.isBlank()) ? password : "password123";
        User user = new User(name, email, passwordEncoder.encode(rawPass), role != null ? role.toUpperCase() : "CASHIER");
        User saved = userRepository.save(user);

        return ResponseEntity.ok(new UserDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.getStatus()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User u = userOpt.get();
        if (body.containsKey("name")) u.setName(body.get("name"));
        if (body.containsKey("role")) u.setRole(body.get("role").toUpperCase());
        if (body.containsKey("status")) u.setStatus(body.get("status"));

        User saved = userRepository.save(u);
        return ResponseEntity.ok(new UserDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), saved.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
