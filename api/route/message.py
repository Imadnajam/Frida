from fastapi import APIRouter, HTTPException
from api.config.db import get_database
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Initialize the database
db = get_database()


# Create a Pydantic model for the request body
class MessageCreateRequest(BaseModel):
    content: str
    sender_name: str
    sender_email: EmailStr
    subject: Optional[str] = None


# Message Controller
class MessageController:
    def __init__(self, db):
        self.message_model = MessageModel(db)

    def create_message(self, content, sender_name, sender_email, subject=None):
        return self.message_model.create_message(
            content, sender_name, sender_email, subject
        )

    def get_all_messages(self):
        return self.message_model.get_all_messages()

    def get_message_by_id(self, message_id):
        return self.message_model.find_message_by_id(message_id)

    def get_messages_by_email(self, email):
        return self.message_model.find_messages_by_email(email)

    def update_message(self, message_id, update_fields):
        return self.message_model.update_message(message_id, update_fields)

    def mark_as_read(self, message_id):
        return self.message_model.mark_as_read(message_id)

    def delete_message(self, message_id):
        return self.message_model.delete_message(message_id)


# Import the MessageModel
from bson import ObjectId
from pymongo.collection import Collection


class MessageModel:
    def __init__(self, db):
        # Assuming db is a MongoDB database instance
        self.collection = db.messages  # Use the "messages" collection

    def create_message(
        self, content, sender_name, sender_email, subject=None, timestamp=None
    ):
        message_data = {
            "content": content,
            "sender_name": sender_name,
            "sender_email": sender_email,
            "subject": subject,
            "timestamp": timestamp or datetime.now(),
            "read": False,
        }
        result = self.collection.insert_one(message_data)
        return str(result.inserted_id)

    def get_all_messages(self):
        messages = list(self.collection.find())
        # Convert ObjectId to string for easy use in JSON
        for message in messages:
            message["_id"] = str(message["_id"])
        return messages

    def find_message_by_id(self, message_id):
        message = self.collection.find_one({"_id": ObjectId(message_id)})
        if message:
            message["_id"] = str(message["_id"])  # Convert ObjectId to string
        return message

    def find_messages_by_email(self, email):
        messages = list(self.collection.find({"sender_email": email}))
        # Convert ObjectId to string for easy use in JSON
        for message in messages:
            message["_id"] = str(message["_id"])
        return messages

    def update_message(self, message_id, update_fields):
        result = self.collection.update_one(
            {"_id": ObjectId(message_id)}, {"$set": update_fields}
        )
        return result.modified_count

    def mark_as_read(self, message_id):
        return self.update_message(message_id, {"read": True})

    def delete_message(self, message_id):
        result = self.collection.delete_one({"_id": ObjectId(message_id)})
        return result.deleted_count


message_controller = MessageController(db)

message_routes = APIRouter()


# POST: Create a message
@message_routes.post("/messages")
async def create_message(message: MessageCreateRequest):
    try:
        new_message_id = message_controller.create_message(
            message.content, message.sender_name, message.sender_email, message.subject
        )
        return {"message_id": new_message_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating message: {str(e)}")


# GET: Get all messages
@message_routes.get("/messages")
async def get_all_messages():
    try:
        messages = message_controller.get_all_messages()
        return messages
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error retrieving messages: {str(e)}"
        )


# GET: Get message by ID
@message_routes.get("/messages/{message_id}")
async def get_message_by_id(message_id: str):
    message = message_controller.get_message_by_id(message_id)
    if message:
        return message
    else:
        raise HTTPException(status_code=404, detail="Message not found")


# GET: Get messages by email
@message_routes.get("/messages/email/{email}")
async def get_messages_by_email(email: str):
    messages = message_controller.get_messages_by_email(email)
    return messages


# PUT: Update message
@message_routes.put("/messages/{message_id}")
async def update_message(message_id: str, update_fields: dict):
    updated_count = message_controller.update_message(message_id, update_fields)
    if updated_count > 0:
        return {"message": "Message updated successfully"}
    else:
        raise HTTPException(
            status_code=404, detail="Message not found or no changes made"
        )


# PUT: Mark message as read
@message_routes.put("/messages/{message_id}/read")
async def mark_message_as_read(message_id: str):
    updated_count = message_controller.mark_as_read(message_id)
    if updated_count > 0:
        return {"message": "Message marked as read"}
    else:
        raise HTTPException(
            status_code=404, detail="Message not found or already marked as read"
        )


# DELETE: Delete message
@message_routes.delete("/messages/{message_id}")
async def delete_message(message_id: str):
    deleted_count = message_controller.delete_message(message_id)
    if deleted_count > 0:
        return {"message": "Message deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Message not found")
