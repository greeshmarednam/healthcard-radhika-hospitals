from . import models
from rest_framework import serializers


class HealthcardTableSeriliazer(serializers.ModelSerializer):
    class Meta:
        model = models.HealthcardTable
        field = '__all__'
