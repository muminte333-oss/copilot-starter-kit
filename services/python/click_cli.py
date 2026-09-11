import click
import requests
import json
from typing import Optional
from datetime import datetime

API_BASE_URL = "http://localhost:3000/api/v1"

@click.group()
def cli():
    """Copilot CLI - Task Management Tool"""
    pass

@cli.command()
def health():
    """Check API health status"""
    try:
        response = requests.get("http://localhost:3000/health", timeout=5)
        if response.status_code == 200:
            click.echo(click.style("✅ API is healthy", fg="green"))
            click.echo(json.dumps(response.json(), indent=2))
        else:
            click.echo(click.style("❌ API returned an error", fg="red"))
    except requests.exceptions.ConnectionError:
        click.echo(click.style("❌ Cannot connect to API", fg="red"))
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@cli.group()
def tasks():
    """Manage tasks"""
    pass

@tasks.command(name="list")
def list_tasks():
    """List all tasks"""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks")
        data = response.json()
        
        if not data.get('tasks'):
            click.echo("No tasks found.")
            return
        
        click.echo(f"\n📋 Tasks ({data.get('count')} total):\n")
        for task in data['tasks']:
            status_emoji = "✅" if task['status'] == "completed" else "⏳"
            click.echo(f"{status_emoji} [{task['id'][:8]}...] {task['title']}")
            if task['description']:
                click.echo(f"   Description: {task['description']}")
            click.echo()
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@tasks.command(name="create")
@click.option('--title', prompt='Task title', help='Title of the task')
@click.option('--description', default='', help='Task description')
def create_task(title: str, description: str):
    """Create a new task"""
    try:
        payload = {
            'title': title,
            'description': description
        }
        response = requests.post(f"{API_BASE_URL}/tasks", json=payload)
        
        if response.status_code == 201:
            task = response.json()
            click.echo(click.style(f"✅ Task created: {task['id']}", fg="green"))
            click.echo(json.dumps(task, indent=2, default=str))
        else:
            click.echo(click.style(f"❌ Error: {response.text}", fg="red"))
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@tasks.command(name="get")
@click.argument('task_id')
def get_task(task_id: str):
    """Get a specific task"""
    try:
        response = requests.get(f"{API_BASE_URL}/tasks/{task_id}")
        
        if response.status_code == 200:
            task = response.json()
            click.echo(json.dumps(task, indent=2, default=str))
        else:
            click.echo(click.style(f"❌ Task not found", fg="red"))
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@tasks.command(name="complete")
@click.argument('task_id')
def complete_task(task_id: str):
    """Mark a task as completed"""
    try:
        payload = {'status': 'completed'}
        response = requests.put(f"{API_BASE_URL}/tasks/{task_id}", json=payload)
        
        if response.status_code == 200:
            task = response.json()
            click.echo(click.style(f"✅ Task marked as completed", fg="green"))
            click.echo(json.dumps(task, indent=2, default=str))
        else:
            click.echo(click.style(f"❌ Task not found", fg="red"))
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@tasks.command(name="delete")
@click.argument('task_id')
@click.confirmation_option(prompt='Are you sure you want to delete this task?')
def delete_task(task_id: str):
    """Delete a task"""
    try:
        response = requests.delete(f"{API_BASE_URL}/tasks/{task_id}")
        
        if response.status_code == 200:
            click.echo(click.style(f"✅ Task deleted successfully", fg="green"))
        else:
            click.echo(click.style(f"❌ Task not found", fg="red"))
    except Exception as e:
        click.echo(click.style(f"❌ Error: {str(e)}", fg="red"))

@cli.command()
def version():
    """Show CLI version"""
    click.echo("Copilot CLI version 1.0.0")

if __name__ == '__main__':
    cli()
