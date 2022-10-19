from django.db import models

from authentication.models import User


class Question(models.Model):
    """
    Question has multiple choices given to the user to answer the Question
    """
    owner = models.ForeignKey(User, related_name='questions', on_delete=models.CASCADE)
    text = models.CharField(max_length=1024)
    date_published = models.DateTimeField(auto_now_add=True)
    vote_count = models.IntegerField(default=0)

    def __str__(self):
        return f'Question #{self.pk}: {self.text}'


class Choice(models.Model):
    """
    Choice is a simple text which is an option to answer a Question
    """
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=1024)
    vote_count = models.IntegerField(default=0)

    class Meta:
        ordering = ['pk', 'text', 'vote_count']

    def __str__(self):
        return f'Choice #{self.pk}: {self.text} -- for {self.question}'


class Vote(models.Model):
    """
    Vote is a pair (user, choice) which stands to tell if user have voted for a choice
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    date_voted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Vote #{self.pk}: {self.user.username} voted for "{self.choice.text}"\
         in question "{self.question.text}"'
