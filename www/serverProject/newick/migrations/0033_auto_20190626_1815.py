# Generated by Django 2.0.9 on 2019-06-26 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0032_auto_20190626_1733'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pca',
            name='polygon',
            field=models.TextField(default='[]', max_length=100000, verbose_name='polygon'),
        ),
    ]