from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.HealthcardTable)
admin.site.register(models.UsersTable)
admin.site.register(models.TokenTable)
admin.site.register(models.AdminTable)
admin.site.register(models.AdminToken_Table)
admin.site.register(models.Healthcarddoc)