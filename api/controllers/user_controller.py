import bcrypt
from models.user_model import UserModel


class UserController:
    def __init__(self, db):
        self.user_model = UserModel(db)

    def create_user(self, username, email, password, role="user"):
        # Hash the password before storing
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return self.user_model.create_user(username, email, hashed_password, role)

    def get_all_users(self):
        return self.user_model.get_all_users()

    def get_user_by_id(self, user_id):
        return self.user_model.find_user_by_id(user_id)

    def update_user(self, user_id, update_fields):
        if "password" in update_fields:
            # Hash the new password if provided
            update_fields["password"] = bcrypt.hashpw(
                update_fields["password"].encode("utf-8"), bcrypt.gensalt()
            )
        return self.user_model.update_user(user_id, update_fields)

    def delete_user(self, user_id):
        return self.user_model.delete_user(user_id)
