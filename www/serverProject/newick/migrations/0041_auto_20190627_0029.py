# Generated by Django 2.0.9 on 2019-06-27 00:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0040_auto_20190627_0025'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bacteria',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='drug',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='facility',
            options={'ordering': ['mpc', 'name']},
        ),
    ]
