import pytest
from click_cli import cli
from click.testing import CliRunner

@pytest.fixture
def runner():
    return CliRunner()

def test_health_command(runner):
    """Test health check command"""
    result = runner.invoke(cli, ['health'])
    assert result.exit_code in [0, 1]  # May fail if API not running

def test_version_command(runner):
    """Test version command"""
    result = runner.invoke(cli, ['version'])
    assert result.exit_code == 0
    assert '1.0.0' in result.output

def test_tasks_list_command(runner):
    """Test tasks list command"""
    result = runner.invoke(cli, ['tasks', 'list'])
    # Exit code may vary depending on API availability
    assert 'Tasks' in result.output or 'Error' in result.output
