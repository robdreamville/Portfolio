import logging
from flask import Flask, render_template, request, abort

from config import Config
from utils import (
    get_static_json, 
    get_static_file_content, 
    order_projects_by_weight, 
    filter_projects_by_tag,
    find_project_by_link
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)


@app.route('/')
def index():
    """Home page route."""
    logger.info("Home page accessed")
    return render_template('home.html', common=Config.SITE_INFO)


@app.route('/timeline')
def timeline():
    """Timeline page route."""
    try:
        timeline_data = get_static_json(Config.TIMELINE_FILE)
        logger.info("Timeline page accessed")
        return render_template('timeline.html', common=Config.SITE_INFO, timeline=timeline_data)
    except Exception as e:
        logger.error("Error loading timeline: {}".format(e))
        abort(500)


@app.route('/reading')
def reading():
    """Reading page route."""
    try:
        data = get_static_json(Config.READING_FILE)
        logger.info("Reading page accessed")
        return render_template('reading.html', common=Config.SITE_INFO, data=data)
    except Exception as e:
        logger.error("Error loading reading data: {}".format(e))
        abort(500)


@app.route('/projects')
def projects():
    """Projects page route with optional tag filtering."""
    try:
        projects_data = get_static_json(Config.PROJECTS_FILE).get('projects', [])
        projects_data.sort(key=order_projects_by_weight, reverse=True)

        tag = request.args.get('tags')
        filtered_projects = filter_projects_by_tag(projects_data, tag)
        
        logger.info("Projects page accessed with tag filter: {}".format(tag))
        return render_template('projects.html', common=Config.SITE_INFO, projects=filtered_projects, tag=tag)
    except Exception as e:
        logger.error("Error loading projects: {}".format(e))
        abort(500)


@app.route('/experiences')
def experiences():
    """Experiences page route."""
    try:
        experiences_data = get_static_json(Config.EXPERIENCES_FILE).get('experiences', [])
        experiences_data.sort(key=order_projects_by_weight, reverse=True)
        logger.info("Experiences page accessed")
        return render_template('projects.html', common=Config.SITE_INFO, projects=experiences_data, tag=None)
    except Exception as e:
        logger.error("Error loading experiences: {}".format(e))
        abort(500)


@app.route('/projects/<title>')
def project(title):
    """Individual project/experience page route."""
    try:
        projects_data = get_static_json(Config.PROJECTS_FILE).get('projects', [])
        experiences_data = get_static_json(Config.EXPERIENCES_FILE).get('experiences', [])

        # Find the project or experience by link
        project_item = find_project_by_link(projects_data, title)
        experience_item = find_project_by_link(experiences_data, title)

        if project_item is None and experience_item is None:
            logger.warning("Project/experience not found: {}".format(title))
            return render_template('404.html', common=Config.SITE_INFO), 404

        # Determine which item to use (prefer experience if both exist)
        selected = experience_item if experience_item is not None else project_item
        is_experience = experience_item is not None

        # Ensure selected is not None (this should be guaranteed by the logic above)
        if selected is None:
            logger.error("Unexpected None value for project: {}".format(title))
            return render_template('404.html', common=Config.SITE_INFO), 404

        # Load HTML description if not present in JSON
        if 'description' not in selected:
            path = "experiences" if is_experience else "projects"
            html_path = 'static/{}/{}/{}.html'.format(path, selected["link"], selected["link"])
            html_content = get_static_file_content(html_path)
            
            # If HTML file doesn't exist, use a default description
            if html_content:
                selected['description'] = html_content
            else:
                selected['description'] = '<p>Description for {} is not available.</p>'.format(selected.get('name', title))

        logger.info("Project/experience accessed: {}".format(title))
        return render_template('project.html', common=Config.SITE_INFO, project=selected)
    except Exception as e:
        logger.error("Error loading project {}: {}".format(title, e))
        abort(500)


@app.route('/skills')
def skills():
    """Skills page route."""
    try:
        skills_data = get_static_json("static/files/skills.json")
        logger.info("Skills page accessed")
        return render_template('skills.html', common=Config.SITE_INFO, skills=skills_data)
    except Exception as e:
        logger.error("Error loading skills data: {}".format(e))
        abort(500)


@app.route('/contact')
def contact():
    """Contact page route."""
    logger.info("Contact page accessed")
    return render_template('contact.html', common=Config.SITE_INFO)


@app.route('/test')
def test():
    """Test page route for debugging."""
    logger.info("Test page accessed")
    return render_template('test.html', common=Config.SITE_INFO)


@app.errorhandler(404)
def page_not_found(e):
    """404 error handler."""
    logger.warning("404 error: {}".format(request.url))
    return render_template('404.html', common=Config.SITE_INFO), 404


@app.errorhandler(500)
def internal_server_error(e):
    """500 error handler."""
    logger.error("500 error: {}".format(e))
    return render_template('500.html', common=Config.SITE_INFO), 500


if __name__ == '__main__':
    app.run(debug=Config.DEBUG)
