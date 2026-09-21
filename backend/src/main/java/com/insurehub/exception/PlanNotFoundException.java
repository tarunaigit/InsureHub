package com.insurehub.exception;
import org.springframework.http.HttpStatus;
public class PlanNotFoundException extends ApiException { public PlanNotFoundException(String m){super(HttpStatus.NOT_FOUND,"PLAN_NOT_FOUND",m);} }
