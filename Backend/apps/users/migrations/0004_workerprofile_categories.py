from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_add_is_billed_to_servicerequest'),
        ('users', '0003_passwordresetcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='workerprofile',
            name='categories',
            field=models.ManyToManyField(
                blank=True,
                related_name='workers',
                to='services.category',
            ),
        ),
    ]
