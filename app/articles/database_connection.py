from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://wikiAdmin:_P5JP53hT8@cluster0.w2vxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
class MongoDBAtlas:
    def __init__(self):
        """
        Initialize the MongoDBAtlas class.

        :param connection_string: The MongoDB Atlas connection string.
        :param database_name: The name of the database to connect to.
        """
        self.connection_string = uri
        self.database_name = "laWiki"
        self.client = None
        self.database = None
    
    def connect(self):
        """
        Establish a connection to the MongoDB Atlas database.
        """
        try:
            self.client = MongoClient(self.connection_string, server_api=ServerApi('1'))
            self.database = self.client[self.database_name]
            print(f"Connected to the database: {self.database_name}")
        except Exception as e:
            print(f"An error occurred while connecting to MongoDB: {e}")

    def get_collection(self, collection_name):
        """
        Get a collection from the database.

        :param collection_name: The name of the collection to retrieve.
        :return: The MongoDB collection object.
        """
        if self.database is not None:
            return self.database[collection_name]
        else:
            print("Database connection is not established. Please call the connect() method first.")
            return None
        
    def close_connection(self):
        """
        Close the connection to the MongoDB Atlas database.
        """
        if self.client:
            self.client.close()
            print("Connection to MongoDB closed.")
        else:
            print("No active MongoDB connection to close.")