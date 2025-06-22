import io
import json
from typing import Dict, Any, List, Optional

from config import Config


def get_static_json(path):
    """Load and return JSON data from a static file."""
    file_path = Config.get_static_file_path(path)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


def get_static_file_content(path):
    """Read and return the content of a static file."""
    file_path = Config.get_static_file_path(path)
    try:
        with io.open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""


def order_projects_by_weight(project):
    """Sort projects by weight, defaulting to 0 if no weight is specified."""
    try:
        return int(project.get('weight', 0))
    except (ValueError, TypeError):
        return 0


def filter_projects_by_tag(projects, tag):
    """Filter projects by tag if specified."""
    if tag is None:
        return projects
    
    return [
        project for project in projects 
        if tag.lower() in [project_tag.lower() for project_tag in project.get('tags', [])]
    ]


def find_project_by_link(projects, link):
    """Find a project by its link."""
    return next((p for p in projects if p.get('link') == link), None) 