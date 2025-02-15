from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
# Load environment variables from .env
load_dotenv()
db_uri = os.getenv("MONGODB_URI")


# Create a new client and connect to the server
client = MongoClient(db_uri, server_api=ServerApi("1"))

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
