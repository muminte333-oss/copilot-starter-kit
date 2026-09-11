function handlePullRequest(event) {
  const { action, payload } = event;
  const pr = payload.pull_request;

  console.log(`📝 PR ${action}:`, pr.title);

  switch (action) {
    case 'opened':
      console.log(`✅ New PR #${pr.number} from ${pr.user.login}`);
      break;
    case 'synchronize':
      console.log(`🔄 PR #${pr.number} updated`);
      break;
    case 'closed':
      console.log(`❌ PR #${pr.number} closed`);
      break;
  }

  return {
    handled: true,
    message: `PR ${action} event processed`
  };
}

function handleIssues(event) {
  const { action, payload } = event;
  const issue = payload.issue;

  console.log(`🐛 Issue ${action}:`, issue.title);

  switch (action) {
    case 'opened':
      console.log(`✅ New issue #${issue.number} from ${issue.user.login}`);
      break;
    case 'labeled':
      console.log(`🏷️  Issue #${issue.number} labeled`);
      break;
    case 'closed':
      console.log(`✔️ Issue #${issue.number} closed`);
      break;
  }

  return {
    handled: true,
    message: `Issue ${action} event processed`
  };
}

function handleIssueComment(event) {
  const { action, payload } = event;
  const comment = payload.comment;
  const issue = payload.issue;

  console.log(`💬 Comment ${action} on issue #${issue.number}`);

  return {
    handled: true,
    message: `Comment ${action} event processed`
  };
}

module.exports = {
  handlePullRequest,
  handleIssues,
  handleIssueComment
};
