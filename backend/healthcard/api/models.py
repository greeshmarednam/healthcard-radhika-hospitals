from django.db import models


# Create your models here.

class UsersTable(models.Model):
    mobile_number = models.CharField(max_length=10, unique=True)
    fullname = models.CharField(max_length=100)

    def __str__(self):
        return self.mobile_number


class TokenTable(models.Model):
    token = models.CharField(max_length=40, unique=True)
    mobile_number = models.CharField(max_length=10)
    expiry_date = models.DateField()

    def __str__(self):
        return self.mobile_number


class HealthcardTable(models.Model):
    user_mobile_number = models.CharField(max_length=10)
    healthcard_number = models.CharField(max_length=20, unique=True)
    mobile_number = models.CharField(max_length=10)
    name = models.CharField(max_length=40)
    gender = models.CharField(max_length=10)
    dob = models.CharField(max_length=20)
    mailid = models.CharField(max_length=40, null=True)
    address = models.TextField()
    insurance = models.CharField(max_length=40)
    profile_img = models.TextField(default="")

    def __str__(self):
        return self.healthcard_number

class Healthcarddoc(models.Model):
    healthcard_number = models.CharField(max_length=20, unique=True)
    doc_url = models.TextField()

    def __str__(self):
        return self.healthcard_number

class AdminTable(models.Model):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=40)
    fullname = models.CharField(max_length=40)
    role = models.CharField(max_length=10)

    def __str__(self):
        return self.fullname


class AdminToken_Table(models.Model):
        token = models.CharField(max_length=40, unique=True)
        username = models.CharField(max_length=30)
        expiry_date = models.DateField()

        def __str__(self):
            return self.username
