import axios from 'axios';

/**
 * Fetch pull request html to scrape.
 * @param repository The owner/repository of the pull request.
 * @param prNumber The number of the pull request.
 * @returns {Promise<axios.AxiosResponse>}
 */
export async function fetchPullRequest(repository: string, prNumber: number): Promise<axios.AxiosResponse> {
    if (isNaN(prNumber)) {
        throw new Error(`Pull request number input is not a number.`)
    }
    const url: string = `https://github.com/${repository}/pull/${prNumber}`;
    let res = await axios.get(url)
    if (res.status != 200) {
        throw new Error(`Unable to access '${url}' - make sure you are authorized.`)
    }
    return res
}
