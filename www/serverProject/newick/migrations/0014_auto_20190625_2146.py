# Generated by Django 2.0.9 on 2019-06-25 21:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0013_auto_20190625_2145'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pca',
            old_name='polygons',
            new_name='polygon',
        ),
    ]
