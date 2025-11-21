from django.db import models

class PreferredHospital(models.Model):
    preferred_hospital_id = models.AutoField(primary_key=True)
    hospital_name = models.CharField(max_length=100, null=True, blank=True)
    city_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'preferred_hospital' # Correct table name from SQL
        

    def __str__(self):
        return self.hospital_name or f"Preferred Hospital {self.preferred_hospital_id}"