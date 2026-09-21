package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class DuplicatePolicyException extends ApiException { public DuplicatePolicyException(String m){super(HttpStatus.CONFLICT,"DUPLICATE_POLICY",m);} }
