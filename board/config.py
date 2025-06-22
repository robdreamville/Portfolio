import os
from typing import Dict, Any


class Config:
    """Configuration class for the portfolio application."""
    
    # Basic site information
    SITE_INFO = {
        'first_name': 'Roberto',
        'last_name': 'Galdamez',
        'alias': 'robdreamville'
    }
    
    # File paths
    STATIC_ROOT = os.path.realpath(os.path.dirname(__file__))
    TIMELINE_FILE = "static/files/timeline.json"
    READING_FILE = "static/files/reading.json"
    PROJECTS_FILE = "static/projects/projects.json"
    EXPERIENCES_FILE = "static/experiences/experiences.json"
    
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    @classmethod
    def get_static_file_path(cls, path: str) -> str:
        """Get the full path for a static file."""
        return os.path.join(cls.STATIC_ROOT, path) 