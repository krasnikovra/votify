"""
This file is needed to override 'non_field_errors'
which is kind of weird response on invalid credentials
"""

from rest_framework.views import exception_handler


def core_exception_handler(exc, context):
    response = exception_handler(exc, context)
    handlers = {
        'ValidationError': _handle_validation_error
    }

    # Here we will override a ValidationError handler
    # so we need to know exeption type name
    exception_class = exc.__class__.__name__

    if exception_class in handlers:
        # if exception in out custom handlers then we use them
        return handlers[exception_class](exc, context, response)

    return response


def _handle_validation_error(exc, context, response):
    # Here we override handling validation error
    response.data = {
        'errors': response.data
    }

    return response
