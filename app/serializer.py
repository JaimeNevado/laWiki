def serialize_document(doc):
    return {
        **doc,
        "_id": str(doc["_id"]) if "_id" in doc else None,  # Convert ObjectId to string
    }
