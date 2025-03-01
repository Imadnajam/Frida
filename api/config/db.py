import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_database():
    """
    Connects to MongoDB using the URI provided in the .env file.
    Returns the database object if the connection is successful.
    """
    # Fetch MongoDB URI from environment variables
    db_uri = os.getenv("MONGODB_URI")

    # Check if the URI is provided
    if not db_uri:
        raise ValueError("MONGODB_URI not found in .env file")

    try:
        # Create a new client and connect to the server
        client = MongoClient(db_uri, server_api=ServerApi("1"))

        # Send a ping to confirm a successful connection
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")

        # Return the database object
        return client.get_database()

    except Exception as e:
        # Handle connection errors gracefully
        print(f"An error occurred while connecting to MongoDB: {e}")
        raise  # Re-raise the exception to stop further execution


# Example usage
if __name__ == "__main__":
    try:
        db = get_database()
        print(f"Connected to database: {db.name}")
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
