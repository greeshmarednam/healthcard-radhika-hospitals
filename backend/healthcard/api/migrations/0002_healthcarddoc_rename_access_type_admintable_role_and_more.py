# Generated by Django 5.0.2 on 2024-03-16 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Healthcarddoc',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('healthcard_number', models.CharField(max_length=20, unique=True)),
                ('doc_url', models.TextField()),
            ],
        ),
        migrations.RenameField(
            model_name='admintable',
            old_name='access_type',
            new_name='role',
        ),
        migrations.RemoveField(
            model_name='healthcardtable',
            name='token',
        ),
        migrations.AddField(
            model_name='healthcardtable',
            name='user_mobile_number',
            field=models.CharField(default=' ', max_length=10),
            preserve_default=False,
        ),
    ]
