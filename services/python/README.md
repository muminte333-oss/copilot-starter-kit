# Python CLI Tool

Command-line interface for managing tasks using the Node.js API.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Health Check
```bash
python -m click_cli health
```

### Task Management

**List all tasks**
```bash
python -m click_cli tasks list
```

**Create a new task**
```bash
python -m click_cli tasks create --title "My Task" --description "Task description"
```

**Get a specific task**
```bash
python -m click_cli tasks get <task-id>
```

**Mark task as completed**
```bash
python -m click_cli tasks complete <task-id>
```

**Delete a task**
```bash
python -m click_cli tasks delete <task-id>
```

**Show version**
```bash
python -m click_cli version
```

## Testing

```bash
pytest
pytest --cov  # With coverage
```

## Code Quality

```bash
black .           # Format code
flake8 .          # Lint
mypy .            # Type checking
```

## Project Structure

```
services/python/
├── click_cli.py           # Main CLI application
├── test_click_cli.py      # Unit tests
├── requirements.txt       # Python dependencies
└── Dockerfile            # Docker configuration
```

## Technologies

- **Click** - CLI framework
- **Requests** - HTTP client
- **Pytest** - Testing framework
