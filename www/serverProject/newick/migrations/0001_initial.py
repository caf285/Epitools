# Generated by Django 2.0.9 on 2018-11-05 20:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0009_alter_user_last_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sequence',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50, verbose_name='sequence name')),
                ('date', models.DateField(verbose_name='date published')),
                ('location', models.CharField(max_length=100, verbose_name='address')),
                ('dataFile', models.CharField(max_length=250, verbose_name='sequence file')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.Group')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tree',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('svg', models.CharField(max_length=250, verbose_name='image file')),
                ('dataFile', models.CharField(max_length=250, verbose_name='newick file')),
                ('sequences', models.ManyToManyField(to='newick.Sequence')),
            ],
        ),
    ]