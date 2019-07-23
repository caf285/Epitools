# Generated by Django 2.0.9 on 2019-07-08 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0044_auto_20190627_1731'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facility',
            options={'ordering': ['id']},
        ),
        migrations.AlterField(
            model_name='facility',
            name='id',
            field=models.CharField(max_length=50, primary_key=True, serialize=False, verbose_name='facilityName'),
        ),
        migrations.AlterUniqueTogether(
            name='facility',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='facility',
            name='name',
        ),
    ]