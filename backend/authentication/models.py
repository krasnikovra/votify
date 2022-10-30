import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)

from django.db import models


class UserManager(BaseUserManager):
    """
    Overriding UserManager to implement Django authentication
    within JSON Web Tokens
    """

    def create_user(self, username, email, password):
        """
        Creates and returns a user with his username, email and password
        """
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        if password is None:
            raise TypeError('Users must have a password.')    

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        """ 
        Creates and returns a superuser with his username, email and password
        """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    A User will have username, email and password
    """
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True)

    # As in default Django's User we will not delete any users and
    # instead setting their is_active to False if a user wants to
    # deactivate his profile
    is_active = models.BooleanField(default=True)

    # If a user is a staff of the site, for most users must be False
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ADDITIONAL FIELDS DJANGO REQUIRES TO DEFINE

    # USERNAME_FIELD is the one to use when logging in
    USERNAME_FIELD = 'username'

    # UserManager is capable of managing User objects
    objects = UserManager()

    def __str__(self):
        return f'{self.username} {self.email}'

    @property
    def token(self):
        """
        Just a shortcut to get a token with user.token instead
        of user._generate_jwt_token()
        """
        return self._generate_jwt_token()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def _generate_jwt_token(self):
        """
        Generates JWT token containing user id, expiring in 1 day
        """
        dt = datetime.utcnow() + timedelta(days=1)

        token = jwt.encode({
            'id': self.pk,
            'exp': dt
        }, settings.SECRET_KEY, algorithm='HS256')

        return token
