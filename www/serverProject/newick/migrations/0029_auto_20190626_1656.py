# Generated by Django 2.0.9 on 2019-06-26 16:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0028_auto_20190626_1645'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='amr',
            name='facility',
        ),
        migrations.RemoveField(
            model_name='demoamr',
            name='facility',
        ),
    ]