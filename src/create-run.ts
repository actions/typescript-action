import axios, { AxiosResponse } from 'axios'

const baseUrl = 'https://terraform.io/api/v2'

export async function getWorkspaceId(
    organization: string, 
    workspace: string
): Promise<string> {

  console.log("org value "+ organization)  
  console.log("ws value "+ workspace) 

 // const endpoint = 'organizations/${organization}/workspaces/${workspace}'
  const endpoint = 'organizations/self_hkr/workspaces/learn-terraform-github-actions'

 
  console.log("end point "+ endpoint)

  //const url = '${baseUrl}/${endpont}'
  const url = 'https://app.terraform.io/api/v2/organizations/self_hkr/workspaces/learn-terraform-github-actions'
  console.log("url value "+ url)

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

  
