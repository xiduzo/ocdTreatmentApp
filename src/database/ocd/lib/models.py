import uuid
from django.db import models

# Create your models here.
class UUIDModel(models.Model):
    """
    Common base model that uses UUID as id field and has created_at/modified_at
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
