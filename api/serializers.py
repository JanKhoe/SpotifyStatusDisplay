from rest_framework import serializers
from .models import Room

#Serializing provides a mechanism for translating Django models into other formats
#RoomSerializer then takes a Django model (Room) and creates a Room with the defined fields
class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    
    #what we return as a response
    fields = ('id', 'code', 'host', 
              'guest_can_pause', 'votes_to_skip', 'create_at')
    
  
class CreateRoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    
    #The fields we want to be sent during the POST request
    #Validates the fields that we want to be sent
    fields = ('guest_can_pause', 'votes_to_skip')
    
class UpdateRoomSerializer(serializers.ModelSerializer):
  # override code attribute from .models
  code = serializers.CharField(validators=[])
  
  class Meta:
    model = Room
    # since codes was defined as a unique=True attribute then any paramaters passed through this serilizer will be invalid if the code is not unique
    fields = ('guest_can_pause', 'votes_to_skip', 'code')
    