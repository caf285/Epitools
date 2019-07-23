# Generated by Django 2.0.9 on 2019-06-27 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newick', '0038_auto_20190626_2357'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facility',
            options={'ordering': ('type', 'name')},
        ),
        migrations.AlterField(
            model_name='facility',
            name='type',
            field=models.CharField(choices=[('H', 'Hospital'), ('C', 'Clinic')], default='H', max_length=1, verbose_name='facilityType'),
        ),
    ]