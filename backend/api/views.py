from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.http import Http404

from .serializers import *
from .models import *
from .renderers import *
from authentication.permissions import IsAuthenticatedOrCorsPreflight


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('pk')
    permission_classes = (IsAuthenticatedOrCorsPreflight,)
    serializer_class = QuestionSerializer
    renderer_classes = (QuestionJSONRenderer,)


class VoteView(views.APIView):
    permission_classes = (IsAuthenticatedOrCorsPreflight,)

    def post(self, request, format=None):
        try:
            choice = request.data.get('choice', None)
            if choice is None:
                raise KeyError()
            pk = choice.get('id', None)
            if choice is None:
                raise KeyError()

            choice = Choice.objects.get(pk=pk)

            vote = Vote.objects.filter(user=request.user, question=choice.question)
            
            if vote:
                return Response({
                    'modified': False,
                    'msg': f'You have already voted for \"{vote.first().choice.text}\" in this question',
                }, status.HTTP_200_OK)

            question = choice.question
            choice.vote_count = choice.vote_count + 1
            question.vote_count = question.vote_count + 1
            choice.save()
            question.save()

            Vote.objects.create(user=request.user, question=choice.question, choice=choice)

            return Response({
                'modified': True,
                'msg': f'You have successfully voted for \"{choice.text}\"',
            }, status.HTTP_200_OK)
        except Choice.DoesNotExist:
            return Response({
                'msg': f'There is no choice of id = {pk}',
            }, status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({
                'msg': f'You have not passed an id of choice chosen',
            }, status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            question = request.data.get('question', None)
            if question is None:
                raise KeyError()
            pk = question.get('id', None)
            if pk is None:
                raise KeyError()
            question = Question.objects.get(pk=pk)
            vote = Vote.objects.filter(user=request.user, question=question)
            if not vote:
                raise Vote.DoesNotExist()
            vote = vote[0]
            choice = vote.choice

            choice.vote_count = choice.vote_count - 1
            question.vote_count = question.vote_count - 1
            question.save()
            choice.save()
            vote.delete()
            
            return Response({
                'msg': f'You have successfully cancelled vote "{choice.text}" in "{question.text}"'
            }, status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({
                'msg': f'There is no question of id = {pk}'
            }, status.HTTP_404_NOT_FOUND)
        except Vote.DoesNotExist:
            return Response({
                'msg': f'You did not vote in the question "{question.text}"'
            }, status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({
                'msg': f'You have not passed an id of question'
            }, status.HTTP_400_BAD_REQUEST)    
