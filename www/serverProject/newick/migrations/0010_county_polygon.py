# Generated by Django 2.0.9 on 2019-06-25 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0009_auto_20190625_1635'),
    ]

    operations = [
        migrations.AddField(
            model_name='county',
            name='polygon',
            field=models.TextField(default='[]', max_length=10000, verbose_name='Polygon'),
        ),
    ]