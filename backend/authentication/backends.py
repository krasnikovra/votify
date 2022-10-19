import jwt

from django.conf import settings

from rest_framework import authentication, exceptions

from .models import User


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Token'

    def authenticate(self, request):
        """
        'authenticate' has two possible return values:
            1) None - we return None if we do not want to authenticate.
            Basically, this means that authentication will fail. For example,
            there is no token in the header
            2) (user, token) - we return (user, token) if authentication succeded.

            If something other went wrong we call AuthenticationFailed and let
            Django REST Framework handle it.
        """
        request.user = None

        # 'auth_header' should be list of 2 elements:
        # 1) keyword 'Token'
        # 2) JWT which should be used for authentication
        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()

        if not auth_header:
            return None

        if len(auth_header) == 1:
            # Incorrect auth_header, no keyword or no token
            return None

        elif len(auth_header) > 2:
            # Incorrect auth_header, some useless words
            return None

        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != auth_header_prefix:
            # Incorrect auth_header, prefix is not 'Token' or 'token'
            return None

        # passing further authentication to the next method
        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        """
        Trying to authenticate after successful header parsing
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            msg = 'Authentication failed. Your token has expired.'
            raise exceptions.AuthenticationFailed(msg)
        except Exception:
            msg = 'Authentication failed. Unable to decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = User.objects.get(pk=payload['id'])
        except User.DoesNotExist:
            msg = 'Such user does not exist.'
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = 'User\'s profile has been deactivated.'
            raise exceptions.AuthenticationFailed(msg)

        return (user, token)
