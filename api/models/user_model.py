from datetime import datetime
from bson.objectid import ObjectId


class UserModel:
    def __init__(self, db):
        self.db = db
        self.collection = db["users"] 

    def get_all_users(self):
        # Fetch all users from the database
        return list(self.collection.find())
    def create_user(self, username, email, password, role="user"):
        user = {
            "username": username,
            "email": email,
            "password": password,  
            "role": role,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }
        result = self.users_collection.insert_one(user)
        return result.inserted_id

    def find_user_by_id(self, user_id):
        user = self.users_collection.find_one({"_id": ObjectId(user_id)})
        return user

    def update_user(self, user_id, update_fields):
        update_fields["updatedAt"] = datetime.utcnow()
        result = self.users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_fields}
        )
        return result.modified_count

    def delete_user(self, user_id):
        result = self.users_collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count
