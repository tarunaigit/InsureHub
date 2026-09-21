package com.insurehub.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private ResponseEntity<Map<String,Object>> body(int status, String code, String message) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("timestamp", LocalDateTime.now()); m.put("status", status); m.put("error", code); m.put("message", message);
        return ResponseEntity.status(status).body(m);
    }
    @ExceptionHandler(ApiException.class)
    ResponseEntity<Map<String,Object>> api(ApiException ex) { return body(ex.getStatus().value(), ex.getCode(), ex.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().map(e -> e.getField()+": "+e.getDefaultMessage()).findFirst().orElse("Invalid request");
        return body(400, "VALIDATION_ERROR", message);
    }
    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<Map<String,Object>> badCredentials() { return body(401, "INVALID_CREDENTIALS", "Email or password is incorrect."); }
    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Map<String,Object>> dataIntegrity() { return body(409, "DATA_CONFLICT", "The request conflicts with existing data."); }
    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String,Object>> generic(Exception ex) { return body(500, "INTERNAL_ERROR", ex.getMessage() == null ? "Unexpected server error" : ex.getMessage()); }
}
