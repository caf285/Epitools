# Generated by Django 2.0.9 on 2019-06-26 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0034_auto_20190626_2130'),
    ]

    operations = [
        migrations.AddField(
            model_name='county',
            name='coordinate',
            field=models.CharField(default='_', max_length=50, verbose_name='countyCoord'),
        ),
        migrations.AddField(
            model_name='facility',
            name='coordinate',
            field=models.CharField(default='_', max_length=50, verbose_name='facilityCoord'),
        ),
        migrations.AddField(
            model_name='mpc',
            name='coordinate',
            field=models.CharField(default='_', max_length=50, verbose_name='mpcCoord'),
        ),
        migrations.AddField(
            model_name='pca',
            name='coordinate',
            field=models.CharField(default='_', max_length=50, verbose_name='pcaCoord'),
        ),
        migrations.AddField(
            model_name='region',
            name='coordinate',
            field=models.CharField(default='_', max_length=50, verbose_name='regionCoord'),
        ),
    ]