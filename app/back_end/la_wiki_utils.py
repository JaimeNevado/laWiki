from datetime import datetime
import pytz


def serialize_document(doc):
    """
    Convert ObjectId to string
    """
    return {
        **doc,
        "_id": str(doc["_id"]) if "_id" in doc else None,
    }


def isostr_to_date(
    doc: dict, format_s: str = "%H:%M:%S    %d %b %Y", timezone: str = "Europe/Madrid"
):
    """
    converts iso string of given documment to formatted string
    default format is
        09:06:03    06 May 2024
    """
    return {
        **doc,
        "date": (
            formate_date_and_apply_timezone(doc, format_s, timezone)
            if "date" in doc
            else None
        ),
    }


def formate_date_and_apply_timezone(doc: dict, fmt: str, timezone: str):
    parsed_dt = doc["date"]  # datetime.fromisoformat(doc["date"])
    local_tz = pytz.timezone(timezone)
    local_dt = parsed_dt.astimezone(local_tz)
    return local_dt.strftime(fmt)
