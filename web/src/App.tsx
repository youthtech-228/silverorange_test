import React, { useEffect, useState, useCallback } from 'react';

import './App.css';
import { RepoDetail } from './RepoDetail';

export function App() {
  const [repos, setRepos] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [curRepo, setCurRepo] = useState(null);

  /**
   * @param list
   * @returns list
   * @description Sort the repository list by created date.
   */
  const orderByDate = (list: any[]): any[] => {
    list.sort((repo1, repo2) => {
      const date1 = new Date(repo1.created_at);
      const date2 = new Date(repo2.created_at);
      if (date1.getTime() > date2.getTime()) {
        return 1;
      } else if (date1.getTime() === date2.getTime()) {
        return 0;
      } else {
        return -1;
      }
    });
    return list;
  };
  /**
   * @param language
   * @returns null
   * @description Filter the repository list by language value
   */
  const filterReposByLang = (language: string): void => {
    const reposTemp = [...repos];
    const result = reposTemp.filter((repo) => repo.language === language);
    setRepos(result);
  };
  /**
   * @param repo
   * @description When click one repository from the list, set the current repository value
   */
  const showDetail = (event: React.MouseEvent<HTMLElement>, repo: any) => {
    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    setVisible(true);
    setCurRepo(repo);
  };
  /**
   * @description When click back button, set the visible state value to false
   */
  const handleBack = () => {
    setVisible(false);
    setCurRepo(null);
  };
  /**
   * @description get repository list from the backend api
   */
  const getRepos = useCallback(async () => {
    fetch('http://localhost:4000/repos/')
      .then((response) => response.json())
      .then((data) => {
        const orderdArr = orderByDate(data);
        setRepos(orderdArr);
      });
  }, []);
  useEffect(() => {
    getRepos();
  }, [getRepos]);

  return (
    <div className="App">
      {!visible ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">description</th>
              <th scope="col">language</th>
              <th scope="col">forks cnt</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo: any, index: number) => {
              return (
                <tr
                  key={index}
                  onClick={(event) => {
                    showDetail(event, repo);
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{repo.name}</td>
                  <td>{repo.description}</td>
                  <td>
                    <button
                      onClick={() => {
                        filterReposByLang(repo.language);
                      }}
                    >
                      {repo.language}
                    </button>
                  </td>
                  <td>{repo.forks_count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <RepoDetail
          repo={curRepo}
          handlevisible={() => {
            handleBack();
          }}
        />
      )}
    </div>
  );
}

/**
 * I can use router but I don't need to use router for this small step.
 */
