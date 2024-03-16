import axios from 'axios';

/**
 * Fetch pull request html to scrape.
 * @param repository The owner/repository of the pull request.
 * @param prNumber The number of the pull request.
 * @returns {Promise<axios.AxiosResponse>}
 */
export async function fetchPullRequest(repository: string, prNumber: number, token: string): Promise<axios.AxiosResponse> {
    if (isNaN(prNumber)) {
        throw new Error(`Pull request input is not a number.`)
    }
    const axiosInstance = axios.create({
        baseURL: 'https://github.com/',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    try {
        let response = await axiosInstance.get(`/${repository}/pull/${prNumber}`);
        return response
    }
    catch (err) {
        throw new Error(`${err}`)
    }
}
