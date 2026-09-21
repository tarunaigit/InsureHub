package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class UserNotFoundException extends ApiException { public UserNotFoundException(String m){super(HttpStatus.NOT_FOUND,"USER_NOT_FOUND",m);} }
