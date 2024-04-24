import { Octokit } from "@octokit/rest";

const myKey = process.env.REACT_APP_MY_TOKEN.replaceAll("X", "");
const repo = `auto-test`;

export const fileRead = async (path) => {
  try {
    const octokit = new Octokit({
      auth: myKey,
    });

    const result = await octokit.request(
      `GET /repos/bloodstrawberry/${repo}/contents/${path}`,
      {
        repo: `${repo}`,
        path: `${path}`,
        encoding: "utf-8",
        decoding: "utf-8",
      }
    );

    console.log(result);

    return decodeURIComponent(escape(window.atob(result.data.content)));
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};

const getSHA = async (path, octokit) => {
  const result = await octokit.request(
    `GET /repos/bloodstrawberry/${repo}/contents/${path}`,
    {
      owner: "bloodstrawberry",
      repo: `${repo}`,
      path: `${path}`,
    }
  );

  return result.data.sha;
};

export const fileWrite = async (path, contents) => {
  const octokit = new Octokit({
    auth: myKey,
  });

  const currentSHA = await getSHA(path, octokit);
  const result = await octokit.request(
    `PUT /repos/bloodstrawberry/${repo}/contents/${path}`,
    {
      owner: "bloodstrawberry",
      repo: `${repo}`,
      path: `${path}`,
      message: "commit message!",
      sha: currentSHA,
      committer: {
        name: "bloodstrawberry",
        email: "bloodstrawberry@github.com",
      },
      content: `${btoa(unescape(encodeURIComponent(`${contents}`)))}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(result.status);
};