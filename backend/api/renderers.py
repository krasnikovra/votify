import json
from rest_framework.renderers import JSONRenderer


class QuestionJSONRenderer(JSONRenderer):
    charset = 'utf-8'

    def render(self, data, media_type=None, renderer_context=None):
        detail = data.get('detail', None)

        if detail is not None:
            # if we got error they should not be bound in 'user' field
            return super(QuestionJSONRenderer, self).render(data)

        return json.dumps({
            'question': data
        })
