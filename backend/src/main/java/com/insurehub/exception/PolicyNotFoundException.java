package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class PolicyNotFoundException extends ApiException { public PolicyNotFoundException(String m){super(HttpStatus.NOT_FOUND,"POLICY_NOT_FOUND",m);} }
