from django.db import models

class role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_display_name = models.CharField(max_length=50)
    role_key=models.CharField(max_length=50)

    class Meta:
        db_table = 'role'