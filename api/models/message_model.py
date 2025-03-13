from bson import ObjectId
from pymongo.collection import Collection
from datetime import datetime


class MessageModel:
    def __init__(self, db):
        
        self.collection = db.messages  

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
