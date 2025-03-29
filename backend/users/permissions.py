from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsWorkerOrAdmin(permissions.BasePermission):
    """
    Permission to allow workers and admins to access the view.
    Workers have read-only access to most resources.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admin can do anything
        if request.user.role == 'admin':
            return True
        
        # Workers can only perform safe methods (GET, HEAD, OPTIONS)
        if request.user.role == 'staff' and request.method in permissions.SAFE_METHODS:
            return True
        
        return False

    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.role == 'admin':
            return True
        
        # Workers can only view
        if request.user.role == 'staff' and request.method in permissions.SAFE_METHODS:
            return True
        
        return False

class IsSelfOrAdmin(permissions.BasePermission):
    """
    Permission to only allow users to edit their own profile or admins to edit any profile.
    """
    
    def has_object_permission(self, request, view, obj):
        # Allow if user is admin
        if request.user.role == 'admin':
            return True
        
        # Allow if user is editing their own profile
        return obj == request.user

