import logging
import json
import pymongo
from django.conf import settings
from datetime import datetime

class MongoDBHandler(logging.Handler):
    """
    Custom log handler that writes logs to MongoDB
    """
    
    def __init__(self):
        logging.Handler.__init__(self)
        self.client = None
        self.db = None
        self.collection = None
        self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = pymongo.MongoClient(settings.MONGO_URI)
            self.db = self.client[settings.MONGO_DB]
            self.collection = self.db['logs']
            # Create indexes for better query performance
            self.collection.create_index([('timestamp', pymongo.DESCENDING)])
            self.collection.create_index([('level', pymongo.ASCENDING)])
            self.collection.create_index([('user_id', pymongo.ASCENDING)])
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
    
    def emit(self, record):
        """Write log record to MongoDB"""
        if not self.client:
            self.connect()
        
        if not self.client:
            return
        
        try:
            # Format the record
            log_entry = self.format(record)
            
            # Parse the log message if it's JSON
            message = record.getMessage()
            if message.startswith(('Request:', 'Response:')):
                try:
                    # Extract JSON part
                    json_str = message.split(':', 1)[1].strip()
                    log_data = json.loads(json_str)
                    
                    # Add standard fields
                    log_data['level'] = record.levelname
                    log_data['logger_name'] = record.name
                    log_data['module'] = record.module
                    log_data['created_at'] = datetime.fromtimestamp(record.created)
                    
                    # Insert into MongoDB
                    self.collection.insert_one(log_data)
                except json.JSONDecodeError:
                    # Fall back to standard format if not JSON
                    self.collection.insert_one({
                        'timestamp': datetime.fromtimestamp(record.created).isoformat(),
                        'level': record.levelname,
                        'message': log_entry,
                        'logger_name': record.name,
                        'module': record.module,
                    })
            else:
                # Standard log format
                self.collection.insert_one({
                    'timestamp': datetime.fromtimestamp(record.created).isoformat(),
                    'level': record.levelname,
                    'message': log_entry,
                    'logger_name': record.name,
                    'module': record.module,
                })
        except Exception as e:
            print(f"Error writing to MongoDB: {e}")

