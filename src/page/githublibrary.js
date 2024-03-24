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
        owner: "bloodstrawberry",
        repo: `${repo}`,
        path: `${path}`,
        encoding: "utf-8",
        decoding: "utf-8",
      }
    );

    return decodeURIComponent(escape(window.atob(result.data.content)));
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};
