# Roberto Galdamez - Portfolio Website

A clean, modern portfolio website built with Flask showcasing projects, experiences, and personal information.

## Features

- **Home Page**: Personal introduction and overview
- **Timeline**: Chronological view of experiences and milestones
- **Projects**: Showcase of technical projects with filtering by tags
- **Experiences**: Professional and educational experiences
- **Reading**: Books and articles I've read
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with modern design principles
- **Data**: JSON files for easy content management

## Project Structure

```
board/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── utils.py            # Utility functions
├── static/             # Static assets
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── images/        # Images and icons
│   ├── projects/      # Project-specific files
│   └── experiences/   # Experience-specific files
├── templates/          # HTML templates
└── files/             # JSON data files
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Portfolio - Copy (2)"
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   cd board
   python app.py
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## Configuration

The application can be configured through environment variables or by modifying `config.py`:

- `FLASK_DEBUG`: Enable/disable debug mode
- `SECRET_KEY`: Flask secret key for sessions
- Site information (name, alias) can be customized in `config.py`

## Content Management

### Adding Projects
1. Edit `static/projects/projects.json`
2. Add project details including:
   - `name`: Project title
   - `link`: URL-friendly identifier
   - `date`: Completion date
   - `short`: Brief description
   - `status`: Project status
   - `weight`: Sorting weight (higher = appears first)
   - `tags`: Array of tags for filtering
   - `photos`: Array of image paths

### Adding Experiences
1. Edit `static/experiences/experiences.json`
2. Follow the same structure as projects

### Adding Timeline Events
1. Edit `static/files/timeline.json`
2. Add chronological events with dates and descriptions

### Adding Reading Materials
1. Edit `static/files/reading.json`
2. Add books/articles with titles, authors, and completion dates

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints for better code documentation
- Add docstrings to functions and classes

### Testing
The application includes basic error handling and 404 pages. For more comprehensive testing, consider adding:
- Unit tests with pytest
- Integration tests for routes
- Frontend testing with tools like Selenium

### Deployment
For production deployment:
1. Set `FLASK_DEBUG=False`
2. Use a production WSGI server like Gunicorn
3. Configure environment variables properly
4. Set up proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Name**: Roberto Galdamez
- **Alias**: robdreamville
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile] 