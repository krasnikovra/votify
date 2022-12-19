from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.http import Http404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .serializers import *
from .models import *
from .renderers import *
from votify.permissions import IsAuthenticatedOrCorsPreflight


class QuestionViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticatedOrCorsPreflight,)
    serializer_class = QuestionSerializer
    renderer_classes = (QuestionJSONRenderer,)

    def options(self, request, *args, **kwargs):
        return Response({
            'name': 'Question API endpoint',
        }, status.HTTP_200_OK)

    def post(self, request):
        question = request.data.get('question', {})
        serializer = self.serializer_class(data=question, context={
            'request': request
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_all(self, request):
        questions = Question.objects.all()
        serializer = self.serializer_class(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_specific(self, request, pk=None):
        try:
            question = Question.objects.get(pk=pk)
            serializer = self.serializer_class(question, context={
                'request': request
            })
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            raise Http404("Question not found")

    def get_user_latest(self, request, userpk=None):
        try:
            user = User.objects.get(pk=userpk)
            questions = Question.objects.filter(owner=user).order_by('-date_published')[:3]
            serializer = self.serializer_class(questions, many=True, context={
                'request': request
            })
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise Http404("User not found")

    def get_search_by_mask(self, request):
        QUESTIONS_PER_PAGE = 3
        try:
            text = request.GET.get("text", None)
            if text is None:
                return Response({
                    "pages": 0,
                    "questions": []
                }, status=status.HTTP_200_OK)

            page = request.GET.get("page", 1)
            paginator = Paginator(Question.objects.filter(text__icontains=text), QUESTIONS_PER_PAGE)
            questions = paginator.page(page).object_list

            serializer = self.serializer_class(questions, many=True, context={
                'request': request
            })
            return Response({
                "pages": paginator.num_pages if len(questions) > 0 else 0,
                "questions": serializer.data
            }, status=status.HTTP_200_OK)
        except (EmptyPage, PageNotAnInteger):
            raise Http404("Page not found")


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


class UserView(views.APIView):
    serializer_class = UserSerializer
    renderer_classes = (UserJSONRenderer,)

    def get(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise Http404("User not found")
