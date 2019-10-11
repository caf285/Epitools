# Generated by Django 2.0.9 on 2019-10-03 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0002_auto_20191002_2103'),
    ]

    operations = [
        migrations.AlterField(
            model_name='amr',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterUniqueTogether(
            name='amr',
            unique_together={('facility', 'bacteria', 'site', 'year', 'month')},
        ),
    ]
