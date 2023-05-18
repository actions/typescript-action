import axios, { AxiosResponse } from 'axios'



const baseUrl = 'https://terraform.io/api/v2'

export async function getWorkspaceId(
    organization: string, 
    workspace: string
): Promise<string> {
  const endpoint = 'organizations/${organization}/workspaces/${workspace}'
  const url = '${baseUrl}/${endpont}'
  
  const headers = {
    Authorization: 'Bearer ${process.env.api_token}',
    'Content-Type': 'application/vnd.api+json'
  }
try{
    const response: AxiosResponse<{data?: {id: string}}> = await axios.get(
        url,
        { headers}
    )
    const workspaceId = response?.data?.data?.id
    if (!workspaceId) {
        throw new Error('Failed to retrieve the workspace ID')
    }
    return workspaceId
} catch {
    throw new Error('Failed in `getWorkspaceId()`')
}
}

  
