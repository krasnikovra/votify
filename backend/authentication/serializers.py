from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    # Token must be read only
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'token']

    def create(self, validated_data):
        # Using validated_data dict as kwargs for create_user
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=255, read_only=True)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        # Here we should check for existance of user with data delivered
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None:
            raise serializers.ValidationError(
                'An username address is required to log in.'
            )

        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        user = authenticate(username=username, password=password)

        # if Django's authenticate fails it returns None
        if user is None:
            raise serializers.ValidationError(
                'A user with this username and password was not found.'
            )

        # if user is not active we assume his profile 'deleted' -
        # see models.py for User model for more info
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        # validate should return validated data if valid
        return {
            'username': user.username,
            'email': user.email,
            'token': user.token
        }


class UserSerializer(serializers.ModelSerializer):
    """
    Base User Serializer used to serialize User objects
    """

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'token',)
        read_only_fields = ('token',)

    def update(self, instance, validated_data):
        # we will set all data instead of password as it must be hashed
        password = validated_data.pop('password', None)

        for key, value in validated_data.items():
            # all attrs instead password can be simply copied
            setattr(instance, key, value)

        if password is not None:
            # and django.auth's set_password makes the work for password
            instance.set_password(password)

        instance.save()

        return instance
