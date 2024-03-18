
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'pong_room'
        self.room_group_name = 'pong_group'

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddle_data = text_data_json['paddle_data']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'paddle_update',
                'paddle_data': paddle_data
            }
        )

    # Receive message from room group
    async def paddle_update(self, event):
        paddle_data = event['paddle_data']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'paddle_data': paddle_data
        }))
