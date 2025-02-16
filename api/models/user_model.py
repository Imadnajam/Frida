from bson import ObjectId
from pymongo.collection import Collection


class UserModel:
    def __init__(self, db):
        # Assuming db is a MongoDB database instance
        self.collection = db.users  # Use the "users" collection

    def create_user(self, username, email, password, role):
        user_data = {
            "username": username,
            "email": email,
            "password": password,
            "role": role,
        }
        result = self.collection.insert_one(user_data)
        return str(result.inserted_id)

    def get_all_users(self):
        users = list(self.collection.find())
        # Convert ObjectId to string for easy use in JSON
        for user in users:
            user["_id"] = str(user["_id"])
        return users

    def find_user_by_id(self, user_id):
        user = self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user

    def update_user(self, user_id, update_fields):
        result = self.collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_fields}
        )
        return result.modified_count

    def delete_user(self, user_id):
        result = self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count
