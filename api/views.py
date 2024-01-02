from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.

class RoomView(generics.ListAPIView):
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

class GetRoom(APIView):
  serializer_class = RoomSerializer
  lookup_url_kwarg = 'code'
  
  def get(self, request, format=None):
    code = request.GET.get(self.lookup_url_kwarg)
    if code != None:
      room = Room.objects.filter(code=code)
      if len(room) > 0:
        # .data of a serializer returns a python dict
        data = RoomSerializer(room[0]).data
        data['is_host'] = self.request.session.session_key == room[0].host
        return Response(data, status=status.HTTP_200_OK)
      return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
  
class UserInRoom(APIView):
  def get(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()
    
    data ={
      'code': self.request.session.get('room_code')
    }
    
    #Takes a python dict and serializes it as a JSON response
    return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)
class JoinRoom(APIView):
  lookup_url_kwarg = 'code'
  
  def post(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      #if they do not create one
      self.request.session.create()
      
    code = request.data.get(self.lookup_url_kwarg)
    if code != None:
      room_result = Room.objects.filter(code=code)
      if len(room_result) > 0:
        room = room_result[0]
        #how to store personal temporary data acossiated with the user
        self.request.session['room_code'] = code
        return Response({'message': 'Room Joined!'}, status = status.HTTP_200_OK)
      return Response({'Bad Request': 'Invalid Room Code'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'Bad Request': 'Invalid post data, did not find code key'}, status=status.HTTP_400_BAD_REQUEST)  
  
#APIView allows us to override more general methods
class CreateRoomView(APIView):
  serializer_class = CreateRoomSerializer
  
  #When you connect to a website you establish what is called a "session"
  #A temporary connection between 2 devices
  #Like when a website remembers your password when you already authenticated 30 secs ago
  #Without sessions you would have to sign in everytime you visit even a diff path within the same web
  
  #In django the session data/key is stored within ram which means we lose it everytime we lose connection or stop running the server
  #But we dont care cause my projects at this level are smallscale anywyas
  def post(self, request, format=None):
    
    #GEts session id
    #Checks if the current user has an active session with webserver
    if not self.request.session.exists(self.request.session.session_key):
      #if they do not create one
      self.request.session.create()
    
    #this will take all our data and return a python rep and check if our data is valid
    serializer = self.serializer_class(data=request.data)
    
    #if our fields that were defined within the serializer are existing and valid
    if serializer.is_valid():
      #then create the room
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      host = self.request.session.session_key
      
      
      #if the room already exists
      queryset = Room.objects.filter(host=host)
      if queryset.exists():
        #then simply update the values of the room
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip
        self.request.session['room_code'] = room.code
        #if youre updating a model,
        #you must also pass the update_fields parameter with all the fields you want to update
        room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        
      else:
        room = Room(host = host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
        room.save()
        self.request.session['room_code'] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
    
    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
  
  
# made a new view to update the room although the code is very similar to create
# bc for extensibility ex. multiple rooms for one user or admin perms for non-host users.
# Very easy to change and not limited
class UpdateRoom(APIView):
  serializer_class = UpdateRoomSerializer
  
  # basically an update function for views.
  def patch(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      #if they do not create one
      self.request.session.create()
    # passes our data to the serializer to check if data is valid
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      code = serializer.data.get('code')
      
      queryset = Room.objects.filter(code=code)
      # same thing as checking if the len of quesr set > 0
      # more standard tho i think
      if not queryset.exists():
        return Response({'msg':"Room not found."}, status=status.HTTP_404_NOT_FOUND)
      
      room = queryset[0]
      user_id = self.request.session.session_key
      if room.host != user_id:
        return Response({'msg':"You are not the host"}, status=status.HTTP_403_FORBIDDEN)
      
      room.guest_can_pause = guest_can_pause
      room.votes_to_skip = votes_to_skip
      room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
      return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
    
    return Response({'Bad Request': "Invalid Data!"}, status=status.HTTP_400_BAD_REQUEST)