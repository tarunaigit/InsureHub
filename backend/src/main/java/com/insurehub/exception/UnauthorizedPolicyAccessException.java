package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class UnauthorizedPolicyAccessException extends ApiException { public UnauthorizedPolicyAccessException(String m){super(HttpStatus.FORBIDDEN,"UNAUTHORIZED_POLICY_ACCESS",m);} }
