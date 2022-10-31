from rest_framework.permissions import BasePermission

CORS_PREFLIGHT_METHODS = ['OPTIONS']

class IsAuthenticatedOrCorsPreflight(BasePermission):
    """
    User is authenticated, or is a CORS preflight request
    """

    def has_permission(self, request, view):
        if (request.method in CORS_PREFLIGHT_METHODS or
            request.user and
            request.user.is_authenticated):
            return True
        return False
