from fastapi import APIRouter, HTTPException
from controllers.user_controller import UserController
from config.db import get_database

# Initialize the database
db = get_database()

# Initialize the user controller
user_controller = UserController(db)

# Create a router for user routes
user_routes = APIRouter()


@user_routes.get("/users")
def get_all_users():
    users = user_controller.get_all_users()
    return users


@user_routes.get("/users/{user_id}")
def get_user(user_id: str):
    user = user_controller.get_user_by_id(user_id)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


@user_routes.post("/users")
def create_user(username: str, email: str, password: str, role: str = "user"):
    new_user_id = user_controller.create_user(username, email, password, role)
    return {"user_id": new_user_id}


@user_routes.put("/users/{user_id}")
def update_user(user_id: str, data: dict):
    update_count = user_controller.update_user(user_id, data)
    if update_count > 0:
        return {"message": "User updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found or no changes made")


@user_routes.delete("/users/{user_id}")
def delete_user(user_id: str):
    delete_count = user_controller.delete_user(user_id)
    if delete_count > 0:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
