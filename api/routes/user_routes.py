from flask import Blueprint, jsonify, request
from api.controllers.user_controller import UserController
from api.config.db import get_database

# Initialize the database
db = get_database()

# Initialize the user controller
user_controller = UserController(db)

# Create a blueprint for user routes
user_routes = Blueprint("user_routes", __name__)


@user_routes.route("/users", methods=["GET"])
def get_all_users():
    users = user_controller.get_all_users()
    return jsonify(users)


@user_routes.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = user_controller.get_user_by_id(user_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404


@user_routes.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user_id = user_controller.create_user(
        data["username"], data["email"], data["password"], data.get("role", "user")
    )
    return jsonify({"user_id": new_user_id})


@user_routes.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    update_count = user_controller.update_user(user_id, data)
    if update_count > 0:
        return jsonify({"message": "User updated successfully"})
    else:
        return jsonify({"error": "User not found or no changes made"}), 404


@user_routes.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    delete_count = user_controller.delete_user(user_id)
    if delete_count > 0:
        return jsonify({"message": "User deleted successfully"})
    else:
        return jsonify({"error": "User not found"}), 404
