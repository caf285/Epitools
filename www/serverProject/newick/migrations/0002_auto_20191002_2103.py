# Generated by Django 2.0.9 on 2019-10-02 21:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('newick', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AMR',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='amrId')),
                ('year', models.PositiveSmallIntegerField(default=2000, verbose_name='year')),
                ('month', models.PositiveSmallIntegerField(default=1, verbose_name='month')),
                ('range', models.PositiveSmallIntegerField(default=1, verbose_name='range')),
                ('collected', models.PositiveSmallIntegerField(default=0, verbose_name='collected')),
            ],
            options={
                'ordering': ['facility', 'bacteria', 'site'],
            },
        ),
        migrations.CreateModel(
            name='Antibiotic',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='antibioticName')),
                ('type', models.CharField(default='_', max_length=64, verbose_name='antibioticType')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Bacteria',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='bacteriaName')),
                ('gram', models.CharField(default='_', max_length=8, verbose_name='bacteriaGram')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='CollectionMethod',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='collectionMethod')),
                ('sterile', models.CharField(max_length=4, verbose_name='sterile')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='County',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='countyName')),
                ('lat', models.CharField(default='_', max_length=16, verbose_name='latitude')),
                ('lon', models.CharField(default='_', max_length=16, verbose_name='longitude')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='CountyPCA',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='bridgeId')),
                ('county', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.County')),
            ],
            options={
                'ordering': ['county', 'pca'],
            },
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='facilityName')),
                ('capacity', models.PositiveSmallIntegerField(default=0, verbose_name='capacity')),
                ('certification', models.CharField(default='_', max_length=1, verbose_name='certification')),
                ('address', models.CharField(default='_', max_length=64, verbose_name='address')),
                ('zip', models.CharField(default='_', max_length=16, verbose_name='zipCode')),
                ('phone', models.CharField(default='_', max_length=16, verbose_name='phoneNumber')),
                ('fax', models.CharField(default='_', max_length=16, verbose_name='faxNumber')),
                ('lat', models.CharField(default='_', max_length=16, verbose_name='latitude')),
                ('lon', models.CharField(default='_', max_length=16, verbose_name='longitude')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='FacilityType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type1', models.CharField(db_index=True, max_length=64, verbose_name='facilityType')),
                ('type2', models.CharField(max_length=64, verbose_name='facilitySubtype')),
            ],
        ),
        migrations.CreateModel(
            name='GAS',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='sampleName')),
                ('tg', models.CharField(max_length=64, verbose_name='tgNumber')),
                ('az', models.CharField(max_length=64, verbose_name='azNumber')),
                ('collectionDate', models.DateField(default='2000-1-1', verbose_name='collectionDate')),
                ('r1', models.CharField(max_length=128, verbose_name='read1')),
                ('r2', models.CharField(max_length=128, verbose_name='read2')),
                ('sequenceDate', models.DateField(default='2000-1-1', verbose_name='sequenceDate')),
                ('m1', models.CharField(max_length=16, verbose_name='m1')),
                ('mType', models.CharField(max_length=8, verbose_name='mType')),
                ('facility', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.Facility')),
            ],
        ),
        migrations.CreateModel(
            name='MPC',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='majorPopulationCenter')),
                ('lat', models.CharField(default='_', max_length=16, verbose_name='latitude')),
                ('lon', models.CharField(default='_', max_length=16, verbose_name='longitude')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PCA',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='pcaName')),
                ('lat', models.CharField(default='_', max_length=16, verbose_name='latitude')),
                ('lon', models.CharField(default='_', max_length=16, verbose_name='longitude')),
                ('number', models.PositiveSmallIntegerField(default=0, verbose_name='pcaNumber')),
                ('score', models.PositiveSmallIntegerField(default=0, verbose_name='pcaScore')),
                ('rural', models.CharField(default='_', max_length=16, verbose_name='ruralCode')),
                ('tax', models.CharField(default='_', max_length=2, verbose_name='taxDistrict')),
                ('azmua', models.CharField(default='_', max_length=64, verbose_name='AzMUA')),
                ('pchpsa', models.CharField(default='_', max_length=256, verbose_name='PCHPSA')),
                ('fedmuap', models.CharField(default='_', max_length=256, verbose_name='FedMUAP')),
                ('travel2', models.CharField(default='_', max_length=64, verbose_name='travel2')),
                ('travel3', models.CharField(default='_', max_length=64, verbose_name='travel3')),
                ('mpc1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mpc1', to='newick.MPC')),
                ('mpc2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mpc2', to='newick.MPC')),
                ('mpc3', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mpc3', to='newick.MPC')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name='regionName')),
                ('lat', models.CharField(default='_', max_length=16, verbose_name='latitude')),
                ('lon', models.CharField(default='_', max_length=16, verbose_name='longitude')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Resistance',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='resistanceId')),
                ('pTested', models.PositiveSmallIntegerField(default=0, verbose_name='pTested')),
                ('nTested', models.PositiveSmallIntegerField(default=0, verbose_name='nTested')),
                ('pSusceptible', models.PositiveSmallIntegerField(default=0, verbose_name='pSusceptible')),
                ('nSusceptible', models.PositiveSmallIntegerField(default=0, verbose_name='nSusceptible')),
                ('amr', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.AMR')),
                ('antibiotic', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.Antibiotic')),
            ],
            options={
                'ordering': ['amr', 'antibiotic'],
            },
        ),
        migrations.AlterUniqueTogether(
            name='facilitytype',
            unique_together={('type1', 'type2')},
        ),
        migrations.AddField(
            model_name='facility',
            name='mpc',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mpc', to='newick.MPC'),
        ),
        migrations.AddField(
            model_name='facility',
            name='type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='type', to='newick.FacilityType'),
        ),
        migrations.AddField(
            model_name='countypca',
            name='pca',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.PCA'),
        ),
        migrations.AddField(
            model_name='county',
            name='region',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.Region'),
        ),
        migrations.AddField(
            model_name='amr',
            name='bacteria',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.Bacteria'),
        ),
        migrations.AddField(
            model_name='amr',
            name='facility',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.Facility'),
        ),
        migrations.AddField(
            model_name='amr',
            name='site',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newick.CollectionMethod'),
        ),
    ]