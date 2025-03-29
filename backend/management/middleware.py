import json
import logging
import time
import uuid
from django.utils import timezone

logger = logging.getLogger('management')

class RequestLoggingMiddleware:
    """
    Middleware for logging all requests and responses.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.id = request_id
        
        # Start timer
        start_time = time.time()
        
        # Log request
        self.log_request(request)
        
        # Process request
        response = self.get_response(request)
        
        # Calculate request duration
        duration = time.time() - start_time
        
        # Log response
        self.log_response(request, response, duration)
        
        return response
    
    def log_request(self, request):
        """Log request details"""
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'request_id': getattr(request, 'id', None),
            'type': 'request',
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'user_id': request.user.id if request.user.is_authenticated else None,
            'ip_address': self.get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        }
        
        # Don't log sensitive data like passwords
        if request.method in ('POST', 'PUT', 'PATCH') and not request.path.startswith('/admin'):
            try:
                body = request.body.decode('utf-8')
                if body:
                    data = json.loads(body)
                    # Remove sensitive fields
                    if 'password' in data:
                        data['password'] = '[REDACTED]'
                    if 'token' in data:
                        data['token'] = '[REDACTED]'
                    log_data['body'] = data
            except (json.JSONDecodeError, UnicodeDecodeError):
                pass
        
        logger.info(f"Request: {json.dumps(log_data)}")
    
    def log_response(self, request, response, duration):
        """Log response details"""
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'request_id': getattr(request, 'id', None),
            'type': 'response',
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'duration': round(duration * 1000, 2),  # Convert to milliseconds
            'user_id': request.user.id if request.user.is_authenticated else None,
        }
        
        logger.info(f"Response: {json.dumps(log_data)}")
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

