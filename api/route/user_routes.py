from fastapi import APIRouter, HTTPException
from controllers.user_controller import UserController
from config.db import get_database

from pydantic import BaseModel

# Initialize the database
db = get_database()


# Create a Pydantic model for the request body
class UserCreateRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"

user_controller = UserController(db)

user_routes = APIRouter()


# POST: Create a user
@user_routes.post("/users")
async def create_user(user: UserCreateRequest):
    try:
        new_user_id = user_controller.create_user(
            user.username, user.email, user.password, user.role
        )
        return {"user_id": new_user_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")


# GET: Get all users
@user_routes.get("/users")
async def get_all_users():
    try:
        users = user_controller.get_all_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving users: {str(e)}")


# GET: Get user by ID
@user_routes.get("/users/{user_id}")
async def get_user_by_id(user_id: str):
    user = user_controller.get_user_by_id(user_id)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


# PUT: Update user
@user_routes.put("/users/{user_id}")
async def update_user(user_id: str, update_fields: dict):
    updated_count = user_controller.update_user(user_id, update_fields)
    if updated_count > 0:
        return {"message": "User updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found or no changes made")


# DELETE: Delete user
@user_routes.delete("/users/{user_id}")
async def delete_user(user_id: str):
    deleted_count = user_controller.delete_user(user_id)
    if deleted_count > 0:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
