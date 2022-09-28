import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export function RepoDetail({ repo, handlevisible }: any) {
  const [latestCom, setLatestCom] = useState<any>(null);
  const [readme, setReadme] = useState('');
  const getLatestCommit = (commits: any[]) => {
    commits.sort((com1, com2) => {
      const date1 = new Date(com1.created_at);
      const date2 = new Date(com2.created_at);
      if (date1.getTime() > date2.getTime()) {
        return 1;
      } else if (date1.getTime() === date2.getTime()) {
        return 0;
      } else {
        return -1;
      }
    });
    setLatestCom(commits[0]);
  };
  const getReadme = useCallback(async () => {
    fetch(
      `https://raw.githubusercontent.com/${repo.full_name}/master/README.md`,
      {
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          accept: 'application/vnd.github.html',
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {
        setReadme(data);
      });
  }, [repo]);
  const getCommits = useCallback(async () => {
    fetch(`https://api.github.com/repos/${repo.full_name}/commits`)
      .then((response) => response.json())
      .then((data) => {
        getLatestCommit(data);
      });
  }, [repo]);
  useEffect(() => {
    getCommits();
    getReadme();
  }, [getCommits, getReadme]);
  if (latestCom === null) {
    return null;
  }
  return (
    <div className="repo-container">
      <div>most recent commit date: {latestCom.commit.author.name}</div>
      <div>most recent commit date: {latestCom.commit.author.date}</div>
      <div>most recent commit date: {latestCom.commit.message}</div>
      <hr />
      <ReactMarkdown>{readme}</ReactMarkdown>
      <hr />
      <div>
        <button onClick={handlevisible}>Go to home</button>
      </div>
    </div>
  );
}
