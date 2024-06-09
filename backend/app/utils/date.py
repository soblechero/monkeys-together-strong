import time

from datetime import datetime


def year_to_timestamp(year: int) -> (int, int):
    """Convierte el inicio y el final de un año determinado en Unix timestamps."""
    start_date = datetime(year, 1, 1, 0, 0)
    end_date = datetime(year, 12, 31, 23, 59, 59)
    start_timestamp = int(time.mktime(start_date.timetuple()))
    end_timestamp = int(time.mktime(end_date.timetuple()))
    return start_timestamp, end_timestamp
