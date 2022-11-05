import re
from rest_framework import serializers
from .models import *
from authentication.models import User


class ChoiceSerializer(serializers.ModelSerializer):
    """
    Choice is embedded in Question JSON object, so question foreign key is not needed
    """
    class Meta:
        model = Choice
        fields = ('id', 'text', 'vote_count')
        read_only_fields = ('id', 'vote_count')


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question has its all fields and list of choices in JSON representation
    """
    owner = OwnerSerializer(read_only=True)
    choices = ChoiceSerializer(many=True)
    voted_for = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Question
        fields = ('owner', 'id', 'text', 'vote_count',
                  'voted_for', 'date_published', 'choices')

    def validate(self, data):
        print(data)
        return data

    def get_voted_for(self, validated_data):
        user = self.context['request'].user
        vote = Vote.objects.filter(user=user, question=validated_data)
        if not vote:
            return None

        serializer = ChoiceSerializer(vote[0].choice)

        return serializer.data

    def create(self, validated_data):
        """
        Create a Question from JSON of Question contains list of choices
        """
        print(validated_data)
        choices_data = validated_data.pop('choices')
        question_obj = Question.objects.create(text=validated_data['text'],
                                           owner=self.context['request'].user)
        for choice_data in choices_data:
            Choice.objects.create(question=question_obj, **choice_data)
        return question_obj
