from django.db import models
from main.models.role import role

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    frist_name = models.CharField(max_length=100)  # Note: keeping original typo from DDL
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    prefered_hospital_id = models.IntegerField(null=True, blank=True)
    avatar_url = models.ImageField(upload_to='avatars/', null=True, blank=True)
    role = models.ForeignKey(role, on_delete=models.SET_NULL, null=True, blank=True, db_column='role_id')
    age = models.IntegerField()  # Required field for age
    gender = models.CharField(max_length=20)  # Required field for gender
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.frist_name} {self.last_name} ({self.email})"
