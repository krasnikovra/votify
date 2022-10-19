import json
from rest_framework.renderers import JSONRenderer


class UserJSONRenderer(JSONRenderer):
    charset = 'utf-8'

    def render(self, data, media_type=None, renderer_context=None):
        errors = data.get('errors', None)

        if errors is not None:
            # if we got error they should not be bound in 'user' field
            return super(UserJSONRenderer, self).render(data)

        token = data.get('token', None)

        if token is not None and isinstance(token, bytes):
            # If token is a bytes sequence we should decode it firstly
            data['token'] = token.decode('utf-8')

        return json.dumps({
            'user': data
        })
