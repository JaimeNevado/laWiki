from database_connection import MongoDBAtlas;

db = MongoDBAtlas()

db.connect()
wikis = db.get_collection("Wikis")

all_wikis = wikis.find()
print("all wikis:", list(all_wikis))