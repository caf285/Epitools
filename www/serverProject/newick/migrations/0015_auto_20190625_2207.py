# Generated by Django 2.0.9 on 2019-06-25 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0014_auto_20190625_2146'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pca',
            name='polygon',
            field=models.TextField(default='[]', max_length=50000, verbose_name='Polygons'),
        ),
    ]