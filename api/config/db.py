import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()


def get_database():
    db_uri = os.getenv("MONGODB_URI")

    if not db_uri:
        raise ValueError("MONGODB_URI not found in .env file")

    client = MongoClient(db_uri, server_api=ServerApi("1"))

    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"An error occurred: {e}")

    return client.get_database()


# Example usage
db = get_database()
