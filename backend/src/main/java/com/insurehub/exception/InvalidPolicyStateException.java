package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class InvalidPolicyStateException extends ApiException { public InvalidPolicyStateException(String m){super(HttpStatus.CONFLICT,"INVALID_POLICY_STATE",m);} }
